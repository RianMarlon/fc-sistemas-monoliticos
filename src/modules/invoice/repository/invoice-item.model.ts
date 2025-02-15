import {
  Model,
  Column,
  PrimaryKey,
  Table,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import ProductModel from "./product.model";

@Table({
  tableName: "invoice_items",
  timestamps: false,
})
export default class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  @ForeignKey(() => ProductModel)
  declare productId: string;

  @BelongsTo(() => ProductModel, { foreignKey: "productId" })
  declare product: ProductModel;

  @Column({ allowNull: false })
  @ForeignKey(() => InvoiceModel)
  declare invoiceId: string;

  @BelongsTo(() => InvoiceModel, { foreignKey: "invoiceId" })
  declare invoice: InvoiceModel;
}
