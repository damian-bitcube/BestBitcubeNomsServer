import { ValidationErrorItem } from "joi";
import { OrderItem, NumberPlate } from "./order-management/order.repository";

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
  "order:deleted": (id: NumberPlate) => void;
}

export interface ClientEvents {
  "order:list": (callback: (res: Response<OrderItem[]>) => void) => void;

  "order:create": (
    payload: Omit<OrderItem, "id">,
    callback: (res: Response<NumberPlate>) => void
  ) => void;

  "order:read": (id: NumberPlate, callback: (res: Response<OrderItem>) => void) => void;

  "order:update": (
    payload: OrderItem,
    callback: (res?: Response<void>) => void
  ) => void;

  "order:delete": (id: NumberPlate, callback: (res?: Response<void>) => void) => void;
}
