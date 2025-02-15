import { Sequelize, DataTypes } from "sequelize";
import { MigrationFn } from "umzug";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("invoice_items", {
    id: {
      primaryKey: true,
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    productId: {
      type: DataTypes.STRING(36),
      references: {
        model: "products",
        key: "id",
      },
    },
    invoiceId: {
      type: DataTypes.STRING(36),
      references: {
        model: "invoices",
        key: "id",
      },
    },
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("invoice_items");
};
