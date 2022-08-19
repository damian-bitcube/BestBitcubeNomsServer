import { ValidationErrorItem } from "joi";
import { NumberPlate, Order } from "./order-management/order.repository";

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
  "order:found": (order: Order) => void;
  "order:confirmed": (order: Order) => void;
  "order:deleted": (id: string) => void;
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
  "order:find": (
    numberPlate: string,
    callback: (res: Response<Order>) => void
  ) => void;
  "order:delete": (id: string, callback: (res?: Response<void>) => void) => void;
}
