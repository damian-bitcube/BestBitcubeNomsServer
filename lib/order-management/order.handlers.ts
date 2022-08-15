import { Errors, mapErrorDetails, sanitizeErrorMessage } from "../util";
import { v4 as uuid } from "uuid";
import { Components } from "../app";
import Joi from "joi";
import { OrderItem, NumberPlate } from "./order.repository";
import { ClientEvents, Response, ServerEvents } from "../events";
import { Socket } from "socket.io";

const idSchema = Joi.string().guid({
  version: "uuidv4",
});

const orderItemSchema = Joi.object({
  id: idSchema.alter({
    create: (schema) => schema.forbidden(),
    update: (schema) => schema.required(),
  }),
  title: Joi.string().max(256).required(),
  qty: Joi.number().max(25).required(),
  size: Joi.string(),
  completed: Joi.boolean().required(),
});

export default function (components: Components) {
  const { orderRepository: orderRepository } = components;
  return {
    createOrder: async function (
      payload: Omit<OrderItem, "id">,
      callback: (res: Response<NumberPlate>) => void
    ) {
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      // validate the payload
      const { error, value } = orderItemSchema.tailor("create").validate(payload, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return callback({
          error: Errors.INVALID_PAYLOAD,
          errorDetails: mapErrorDetails(error.details),
        });
      }

      value.id = uuid();

      // persist the entity
      try {
        await orderRepository.save(value);
      } catch (e) {
        return callback({
          error: sanitizeErrorMessage(e),
        });
      }

      // acknowledge the creation
      callback({
        data: value.id,
      });

      // notify the other users
      socket.broadcast.emit("order:created", value);
    },

    readOrder: async function (
      id: NumberPlate,
      callback: (res: Response<OrderItem>) => void
    ) {
      const { error } = idSchema.validate(id);

      if (error) {
        return callback({
          error: Errors.ENTITY_NOT_FOUND,
        });
      }

      try {
        const order = await orderRepository.findById(id);
        callback({
          data: order,
        });
      } catch (e) {
        callback({
          error: sanitizeErrorMessage(e),
        });
      }
    },

    updateOrder: async function (
      payload: OrderItem,
      callback: (res?: Response<void>) => void
    ) {
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      const { error, value } = orderItemSchema.tailor("update").validate(payload, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return callback({
          error: Errors.INVALID_PAYLOAD,
          errorDetails: mapErrorDetails(error.details),
        });
      }

      try {
        await orderRepository.save(value);
      } catch (e) {
        return callback({
          error: sanitizeErrorMessage(e),
        });
      }

      callback();
      socket.broadcast.emit("order:updated", value);
    },

    deleteOrder: async function (
      id: NumberPlate,
      callback: (res?: Response<void>) => void
    ) {
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      const { error } = idSchema.validate(id);

      if (error) {
        return callback({
          error: Errors.ENTITY_NOT_FOUND,
        });
      }

      try {
        await orderRepository.deleteById(id);
      } catch (e) {
        return callback({
          error: sanitizeErrorMessage(e),
        });
      }

      callback();
      socket.broadcast.emit("order:deleted", id);
    },

    listOrder: async function (callback: (res: Response<OrderItem[]>) => void) {
      try {
        callback({
          data: await orderRepository.findAll(),
        });
      } catch (e) {
        callback({
          error: sanitizeErrorMessage(e),
        });
      }
    },
  };
}
