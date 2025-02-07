import {
  BelongsTo,
  Column,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import OrderModel from "./order.model";

@Table({
  modelName: "transaction-model-payment",
  tableName: "transactions",
  timestamps: false,
})
export default class TransactionModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare orderId: string;

  @BelongsTo(() => OrderModel, { foreignKey: "orderId" })
  declare order: OrderModel;

  @Column({ allowNull: false })
  declare amount: number;

  @Column({ allowNull: false })
  declare status: string;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
