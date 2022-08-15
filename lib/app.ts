import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { ClientEvents, ServerEvents } from "./events";
import { OrderRepository } from "./order-management/order.repository";
import createOrderHandlers from "./order-management/order.handlers";

export interface Components {
  orderRepository: OrderRepository;
}

export function createApplication(
  httpServer: HttpServer,
  components: Components,
  serverOptions: Partial<ServerOptions> = {}
): Server<ClientEvents, ServerEvents> {
  const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);

  const {
    createOrder: createOrder,
    readOrder: readOrder,
    updateOrder: updateOrder,
    deleteOrder: deleteOrder,
    listOrder: listOrder,
  } = createOrderHandlers(components);

  io.on("connection", (socket) => {
    socket.on("order:create", createOrder);
    socket.on("order:read", readOrder);
    socket.on("order:update", updateOrder);
    socket.on("order:delete", deleteOrder);
    socket.on("order:list", listOrder);
  });

  return io;
}
