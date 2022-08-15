import { createServer } from "http";
import { createApplication } from "./app";
import { InMemoryOrderRepository } from "./order-management/order.repository";

const httpServer = createServer();

createApplication(
  httpServer,
  {
    orderRepository: new InMemoryOrderRepository(),
  },
  {
    cors: {
      origin: ["http://localhost:4200"],
    },
  }
);

httpServer.listen(3000);
