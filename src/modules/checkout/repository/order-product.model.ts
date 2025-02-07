import {
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import ProductModel from "./product.model";
import OrderModel from "./order.model";

@Table({
  tableName: "orders_products",
})
export default class OrderProductModel extends Model {
  @PrimaryKey
  @Column({
    allowNull: false,
  })
  declare id: string;

  @Column({
    allowNull: false,
  })
  @ForeignKey(() => ProductModel)
  declare productId: string;

  @BelongsTo(() => ProductModel, { foreignKey: "productId" })
  declare product: ProductModel;

  @Column({
    allowNull: false,
  })
  @ForeignKey(() => OrderModel)
  declare orderId: string;

  @BelongsTo(() => OrderModel, { foreignKey: "orderId" })
  declare order: OrderModel;
}
