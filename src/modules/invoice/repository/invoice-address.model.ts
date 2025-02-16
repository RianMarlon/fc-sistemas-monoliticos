import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "invoice_addresses",
  timestamps: false,
})
export default class InvoiceAddressModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare number: string;

  @Column({ allowNull: false })
  declare street: string;

  @Column({ allowNull: true })
  declare complement: string;

  @Column({ allowNull: false })
  declare city: string;

  @Column({ allowNull: false })
  declare state: string;

  @Column({ allowNull: false })
  declare zipCode: string;

  @Column({ allowNull: false })
  declare invoiceId: string;

  @Column({ allowNull: false })
  declare createdAt: Date;
}
