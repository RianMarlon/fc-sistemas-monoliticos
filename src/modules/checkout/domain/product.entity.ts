import BaseEntity from "../../../@shared/domain/entity/base.entity";

type ProductProps = {
  id?: string;
  name: string;
  description: string;
  salesPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Product extends BaseEntity {
  private _name: string;
  private _description: string;
  private _salesPrice: number;

  constructor(props: ProductProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._description = props.description;
    this._salesPrice = props.salesPrice;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get salesPrice(): number {
    return this._salesPrice;
  }
}
