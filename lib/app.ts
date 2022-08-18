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
    takeOrderPhoto:takeOrderPhoto,
    takePickupPhoto:takePickupPhoto,
    startOrder: startOrder,
    confirmOrder: confirmOrder,
    orderList: orderList,
  } = createOrderHandlers(components);

  io.on("connection", (socket) => {
    socket.on("photo:order:take", takeOrderPhoto);
    socket.on("photo:pickup:take", takePickupPhoto);
    socket.on("order:start", startOrder);
    socket.on("order:confirm", confirmOrder);
    socket.on("order:list", orderList);
  });

  return io;
}
/*

*/
