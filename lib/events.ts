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
  "photo:order:taken": () => void;
  "photo:pickup:taken": () => void;
  "order:started": (order: Order) => void;
  "order:confirmed": (order: Order) => void;
  "order:deleted": (id: string) => void;
  "order:item:created": (order: OrderItem) => void;
  "order:item:updated": (order: OrderItem) => void;
  "order:item:deleted": (id: NumberPlate) => void;
}

export interface ClientEvents {
  "photo:order:take": (
    payload: void,
    callback: (res: Response<void>) => void
  ) => void;
  "photo:pickup:take": (
    payload: void,
    callback: (res: Response<void>) => void
  ) => void;
  "order:start": (
    payload: Order,
    callback: (res: Response<NumberPlate>) => void
  ) => void;
  "order:confirm": (
    payload: Order,
    callback: (res: Response<NumberPlate>) => void
  ) => void;
  "order:list": (callback: (res: Response<Order[]>) => void) => void;
  "order:delete": (id: string, callback: (res?: Response<void>) => void) => void;
  
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
