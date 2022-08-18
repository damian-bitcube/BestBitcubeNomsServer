import { Errors } from "../util";

abstract class CrudRepository<T, ID> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: ID): Promise<T>;
  abstract save(entity: T): Promise<void>;
  abstract deleteById(id: ID): Promise<void>;
}

export type NumberPlate = string;
export class Vehicle {
  constructor(plate?: string, color?: string, make?: string, model?: string, type?: string) {
    this.plate = plate ?? undefined;
    this.make = make ?? undefined;
    this.model = model ?? undefined;
    this.color = color ?? undefined;
    this.vehicleType = type ?? undefined;
  }
  plate?: string;
  make?: string;
  model?: string;
  color?: string;
  vehicleType?: string;
}

export class OrderDetail {
  constructor(id?: number) {
    if (id) {
      this.id = id;
    }
    this.orderTime = new Date();
    this.content = [];
  }
  id?: number;
  orderTime: Date;
  completeTime?: Date;
  status?:  any;
  content?: OrderItem[];
}
export class Order {
  id: string;
  vehicleDetail: Vehicle;
  orderDetail: OrderDetail;
  constructor(id:string){
    this.id = id;
    this.vehicleDetail = new Vehicle();
    this.orderDetail = new OrderDetail();
  }
}
export interface OrderItem {
  id: string;
  title?: string;
  size?: string;
  itemType?: any;
  comment?: string;
  completed?: boolean;
  qty?: number;
}

export abstract class OrderRepository extends CrudRepository<Order, NumberPlate> {}

export class InMemoryOrderRepository extends OrderRepository {
  private readonly orders: Map<NumberPlate, Order> = new Map();

  findAll(): Promise<Order[]> {
    const entities = Array.from(this.orders.values());
    return Promise.resolve(entities);
  }

  findById(id: NumberPlate): Promise<Order> {
    if (this.orders.has(id)) {
      return Promise.resolve(this.orders.get(id)!);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  save(entity: Order): Promise<void> {
    this.orders.set(entity.id, entity);
    return Promise.resolve();
  }

  deleteById(id: NumberPlate): Promise<void> {
    const deleted = this.orders.delete(id);
    if (deleted) {
      return Promise.resolve();
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }
}
