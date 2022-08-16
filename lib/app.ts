import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { ClientEvents, ServerEvents } from "./events";
import createOrderHandlers from "./order-management/order.handlers";
import { Components } from "./components";

export function createApplication(
  httpServer: HttpServer,
  components: Components,
  serverOptions: Partial<ServerOptions> = {}
): Server<ClientEvents, ServerEvents> {
  const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);

  const {
    createOrderItem: createOrderItem,
    readOrderItem: readOrderItem,
    updateOrderItem: updateOrderItem,
    deleteOrderItem: deleteOrderItem,
    listOrderItem: listOrderItem,
  } = createOrderHandlers(components);

  io.on("connection", (socket) => {
    socket.on("order:item:create", createOrderItem);
    socket.on("order:item:read", readOrderItem);
    socket.on("order:item:update", updateOrderItem);
    socket.on("order:item:delete", deleteOrderItem);
    socket.on("order:item:list", listOrderItem);
  });

  return io;
}
/*

*/
