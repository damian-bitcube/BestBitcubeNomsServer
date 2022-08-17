import { Errors, mapErrorDetails, sanitizeErrorMessage } from "../util";
import { v4 as uuid } from "uuid";
import * as Joi from "joi";
import { OrderItem, NumberPlate, Order } from "./order.repository";
import { ClientEvents, Response, ServerEvents } from "../events";
import { Socket } from "socket.io";
import { Components } from "../components";

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
  const { orderItemRepository: orderItemRepository, orderRepository:orderRepository  } = components;
  return {
    takeOrderPhoto: async function (
      payload: void
    ) {
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      // persist the entity
      // try {
      //   await orderRepository.save(payload);
      // } catch (e) {
      //   return callback({
      //     error: sanitizeErrorMessage(e),
      //   });
      // }

      // acknowledge the creation
      // callback(void);

      // notify the other users
      socket.broadcast.emit("photo:order:taken");
    }, 
    takePickupPhoto: async function (
      payload: void
    ) {
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      // persist the entity
      // try {
      //   await orderRepository.save(payload);
      // } catch (e) {
      //   return callback({
      //     error: sanitizeErrorMessage(e),
      //   });
      // }

      // acknowledge the creation
      // callback(void);

      // notify the other users
      socket.broadcast.emit("photo:pickup:taken");
    }, 
    startOrder: async function (
      payload: Order,
      callback: (res: Response<NumberPlate>) => void
    ) {
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      // persist the entity
      try {
        await orderRepository.save(payload);
      } catch (e) {
        return callback({
          error: sanitizeErrorMessage(e),
        });
      }

      // acknowledge the creation
      callback({
        data: payload.id,
      });

      // notify the other users
      socket.broadcast.emit("order:started", payload);
    }, 
     confirmOrder: async function (
      payload: Order,
      callback: (res: Response<NumberPlate>) => void
    ) {
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      // persist the entity
      try {
        await orderRepository.save(payload);
      } catch (e) {
        return callback({
          error: sanitizeErrorMessage(e),
        });
      }

      // acknowledge the creation
      callback({
        data: payload.id,
      });

      // notify the other users
      socket.broadcast.emit("order:confirmed", payload);
    },
    orderlist: async function (callback: (res: Response<Order[]>) => void) {
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
    deleteOrder: async function (
      id: NumberPlate,
      callback: (res?: Response<void>) => void
    ) {
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

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


    createOrderItem: async function (
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
        await orderItemRepository.save(value);
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
      socket.broadcast.emit("order:item:created", value);
    },

    readOrderItem: async function (
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
        const order = await orderItemRepository.findById(id);
        callback({
          data: order,
        });
      } catch (e) {
        callback({
          error: sanitizeErrorMessage(e),
        });
      }
    },

    updateOrderItem: async function (
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
        await orderItemRepository.save(value);
      } catch (e) {
        return callback({
          error: sanitizeErrorMessage(e),
        });
      }

      callback();
      socket.broadcast.emit("order:item:updated", value);
    },

    deleteOrderItem: async function (
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
        await orderItemRepository.deleteById(id);
      } catch (e) {
        return callback({
          error: sanitizeErrorMessage(e),
        });
      }

      callback();
      socket.broadcast.emit("order:item:deleted", id);
    },

    listOrderItem: async function (callback: (res: Response<OrderItem[]>) => void) {
      try {
        callback({
          data: await orderItemRepository.findAll(),
        });
      } catch (e) {
        callback({
          error: sanitizeErrorMessage(e),
        });
      }
    },
  };
}
