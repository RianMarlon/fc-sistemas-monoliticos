import {
  BelongsTo,
  BelongsToMany,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { ClientModel } from "./client.model";
import OrderProductModel from "./order-product.model";
import ProductModel from "./product.model";

@Table({
  modelName: "order-model-checkout",
  tableName: "orders",
  timestamps: false,
})
export default class OrderModel extends Model {
  @PrimaryKey
  @Column({
    allowNull: false,
  })
  declare id: string;

  @Column({
    allowNull: false,
  })
  declare status: string;

  @Column({
    allowNull: false,
  })
  declare clientId: string;

  @BelongsTo(() => ClientModel, { foreignKey: "clientId" })
  declare client: ClientModel;

  @HasMany(() => OrderProductModel, "orderId")
  declare orderProducts: OrderProductModel[];

  @BelongsToMany(() => ProductModel, () => OrderProductModel)
  declare products: ProductModel[];

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
