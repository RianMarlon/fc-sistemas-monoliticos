import BaseEntity from "../../../@shared/domain/entity/base.entity";

type InvoiceItemProps = {
  id?: string;
  name: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class InvoiceItem extends BaseEntity {
  private _name: string;
  private _price: number;

  constructor(props: InvoiceItemProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._price = props.price;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }
}
