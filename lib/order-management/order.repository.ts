import { Errors } from "../util";

abstract class CrudRepository<T, ID> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: ID): Promise<T>;
  abstract save(entity: T): Promise<void>;
  abstract deleteById(id: ID): Promise<void>;
}

export type NumberPlate = string;

export interface OrderItem {
  id: NumberPlate;
  title: string;
  size?: string;
  completed: boolean;
  qty: number;
}

export abstract class OrderRepository extends CrudRepository<OrderItem, NumberPlate> {}

export class InMemoryOrderRepository extends OrderRepository {
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
