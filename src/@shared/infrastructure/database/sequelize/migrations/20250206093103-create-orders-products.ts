import { Sequelize, DataTypes } from "sequelize";
import { MigrationFn } from "umzug";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("orders_products", {
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
    orderId: {
      type: DataTypes.STRING(36),
      references: {
        model: "orders",
        key: "id",
      },
    },
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("orders_products");
};
