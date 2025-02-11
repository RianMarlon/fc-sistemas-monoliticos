import {
  BelongsTo,
  Column,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import ClientModel from "./client.model";

@Table({
  modelName: "order-model-payement",
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

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
