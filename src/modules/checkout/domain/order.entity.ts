import AggregateRoot from "../../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../../@shared/domain/entity/base.entity";
import Client from "./client.entity";
import Product from "./product.entity";

type OrderProps = {
  id?: string;
  client: Client;
  products: Product[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Order extends BaseEntity implements AggregateRoot {
  private _client: Client;
  private _products: Product[];
  private _status: string;

  constructor(props: OrderProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._client = props.client;
    this._products = props.products;
    this._status = props.status || "pending";
  }

  approved(): void {
    this._status = "approved";
  }

  get client(): Client {
    return this._client;
  }

  get products(): Product[] {
    return this._products;
  }

  get status(): string {
    return this._status;
  }

  get total(): number {
    return this._products.reduce((total, product) => {
      return total + product.salesPrice;
    }, 0);
  }
}
