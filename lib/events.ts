import { ValidationErrorItem } from "joi";
import { OrderItem, NumberPlate, Order } from "./order-management/order.repository";

interface Error {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

interface Success<T> {
  data: T;
}

export type Response<T> = Error | Success<T>;

export interface ServerEvents {
  "order:started": (order: Order) => void;
  "order:created": (order: Order) => void;
  "order:item:created": (order: OrderItem) => void;
  "order:item:updated": (order: OrderItem) => void;
  "order:item:deleted": (id: NumberPlate) => void;
}

export interface ClientEvents {
  "order:start": (
    payload: Order,
    callback: (res: Response<NumberPlate>) => void
  ) => void;
  "order:create": (
    payload: Order,
    callback: (res: Response<NumberPlate>) => void
  ) => void;
  
  "order:item:list": (callback: (res: Response<OrderItem[]>) => void) => void;
  "order:item:create": (
    payload: Omit<OrderItem, "id">,
    callback: (res: Response<NumberPlate>) => void
  ) => void;
  "order:item:read": (id: NumberPlate, callback: (res: Response<OrderItem>) => void) => void;
  "order:item:update": (
    payload: OrderItem,
    callback: (res?: Response<void>) => void
  ) => void;
  "order:item:delete": (id: NumberPlate, callback: (res?: Response<void>) => void) => void;
}
