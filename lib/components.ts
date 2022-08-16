import { OrderItemRepository, OrderRepository } from "./order-management/order.repository";

export interface Components {
  orderItemRepository: OrderItemRepository;
  orderRepository: OrderRepository;
}
