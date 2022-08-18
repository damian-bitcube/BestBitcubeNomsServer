import { sanitizeErrorMessage } from "../util";
import { NumberPlate, Order } from "./order.repository";
import { ClientEvents, Response, ServerEvents } from "../events";
import { Socket } from "socket.io";
import { Components } from "../components";


export default function (components: Components) {
  const {  orderRepository:orderRepository  } = components;
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
    orderList: async function (callback: (res: Response<Order[]>) => void) {
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
  };
}
