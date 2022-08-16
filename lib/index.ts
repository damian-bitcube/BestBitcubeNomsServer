import { createServer } from "http";
import { createApplication } from "./app";
import { InMemoryOrderItemRepository, InMemoryOrderRepository } from "./order-management/order.repository";

const httpServer = createServer();

createApplication(
  httpServer,
  {
    orderItemRepository: new InMemoryOrderItemRepository(),
    orderRepository: new InMemoryOrderRepository(),
  },
  {
    cors: {
      origin: ["http://localhost:4200"],
    },
  }
);

httpServer.listen(3000);
