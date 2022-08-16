import { Errors } from "../util";

abstract class CrudRepository<T, ID> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: ID): Promise<T>;
  abstract save(entity: T): Promise<void>;
  abstract deleteById(id: ID): Promise<void>;
}

export type NumberPlate = string;
export interface Vehicle {
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
  content?: OrderItem[];
}
export interface Order {
  id: string;
  vehicleDetail: Vehicle;
  orderDetail: OrderDetail;
}
export interface OrderItem {
  id: NumberPlate;
  title?: string;
  size?: string;
  completed?: boolean;
  qty?: number;
}

export abstract class OrderRepository extends CrudRepository<Order, NumberPlate> {}
export abstract class OrderItemRepository extends CrudRepository<OrderItem, NumberPlate> {}

export class InMemoryOrderRepository extends OrderRepository {
  private readonly orders: Map<NumberPlate, Order> = new Map();

  // findAll(id:string): Promise<OrderItem[]> {
  findAll(): Promise<Order[]> {
    // this.orders.set('FLD177FS', {id:'FLD177FS', completed:true, qty:1, size:'medium',title:'cheese burger'} as Order);
    // this.orderItems.filter(x=>x.id == this.id);

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
  export class InMemoryOrderItemRepository extends OrderItemRepository {
  private readonly orderItems: Map<NumberPlate, OrderItem> = new Map();

  findAll(): Promise<OrderItem[]> {
    this.orderItems.set('FLD177FS', {id:'FLD177FS', completed:true, qty:1, size:'medium',title:'cheese burger'} as OrderItem);

    const entities = Array.from(this.orderItems.values());
    return Promise.resolve(entities);
  }

  findById(id: NumberPlate): Promise<OrderItem> {
    if (this.orderItems.has(id)) {
      return Promise.resolve(this.orderItems.get(id)!);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  save(entity: OrderItem): Promise<void> {
    this.orderItems.set(entity.id, entity);
    return Promise.resolve();
  }

  deleteById(id: NumberPlate): Promise<void> {
    const deleted = this.orderItems.delete(id);
    if (deleted) {
      return Promise.resolve();
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }
}
