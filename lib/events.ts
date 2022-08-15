import { ValidationErrorItem } from "joi";
import { OrderItem, OrderItemId } from "./order-management/order.repository";

interface Error {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

interface Success<T> {
  data: T;
}

export type Response<T> = Error | Success<T>;

export interface ServerEvents {
  "order:created": (order: OrderItem) => void;
  "order:updated": (order: OrderItem) => void;
  "order:deleted": (id: OrderItemId) => void;
}

export interface ClientEvents {
  "order:list": (callback: (res: Response<OrderItem[]>) => void) => void;

  "order:create": (
    payload: Omit<OrderItem, "id">,
    callback: (res: Response<OrderItemId>) => void
  ) => void;

  "order:read": (id: OrderItemId, callback: (res: Response<OrderItem>) => void) => void;

  "order:update": (
    payload: OrderItem,
    callback: (res?: Response<void>) => void
  ) => void;

  "order:delete": (id: OrderItemId, callback: (res?: Response<void>) => void) => void;
}
