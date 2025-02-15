import {
  BelongsToMany,
  Column,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import InvoiceAddressModel from "./invoice-address.model";
import InvoiceItemModel from "./invoice-item.model";
import ProductModel from "./product.model";

@Table({
  tableName: "invoices",
  timestamps: false,
})
export default class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare document: string;

  @HasOne(() => InvoiceAddressModel, {
    foreignKey: "invoiceId",
  })
  declare address: InvoiceAddressModel;

  @HasMany(() => InvoiceItemModel, "invoiceId")
  declare invoiceItems: InvoiceItemModel[];

  @BelongsToMany(() => ProductModel, () => InvoiceItemModel)
  declare items: ProductModel[];

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
