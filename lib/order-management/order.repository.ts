import { Errors } from "../util";

abstract class CrudRepository<T, ID> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: ID): Promise<T>;
  abstract save(entity: T): Promise<void>;
  abstract deleteById(id: ID): Promise<void>;
}

export type OrderItemId = string;

export interface OrderItem {
  id: OrderItemId;
  completed: boolean;
  title: string;
}

export abstract class OrderRepository extends CrudRepository<OrderItem, OrderItemId> {}

export class InMemoryOrderRepository extends OrderRepository {
  private readonly orderItems: Map<OrderItemId, OrderItem> = new Map();

  findAll(): Promise<OrderItem[]> {
    this.orderItems.set('1', {id:'1', completed:true, title:'this is a test'} as OrderItem);

    const entities = Array.from(this.orderItems.values());
    return Promise.resolve(entities);
  }

  findById(id: OrderItemId): Promise<OrderItem> {
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

  deleteById(id: OrderItemId): Promise<void> {
    const deleted = this.orderItems.delete(id);
    if (deleted) {
      return Promise.resolve();
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }
}
