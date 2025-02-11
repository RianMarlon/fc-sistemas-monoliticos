import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";

import TransactionModel from "./transaction.model";
import Transaction from "../domain/transaction";
import TransactionRepository from "./transaction.repository";
import { migrator } from "../../../@shared/infrastructure/database/sequelize/migrator";
import ClientModel from "./client.model";
import OrderModel from "./order.model";

describe("TransactionRepository test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([TransactionModel, OrderModel, ClientModel]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  describe("save", () => {
    it("should save a transaction", async () => {
      await ClientModel.create({
        id: "1",
        name: "Client 1",
        email: "test@test.com",
        document: "12345678900",
        street: "Street 1",
        number: "123",
        complement: "Apt 1",
        city: "City 1",
        state: "State 1",
        zipCode: "12345-678",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await OrderModel.create({
        id: "1",
        status: "pending",
        clientId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const transaction = new Transaction({
        id: "1",
        amount: 100,
        orderId: "1",
      });
      transaction.process();

      const repository = new TransactionRepository();
      await repository.save(transaction);

      const transactionCreated = await TransactionModel.findOne({
        where: {
          id: "1",
        },
      });

      expect(transactionCreated.id).toEqual(transaction.id.value);
      expect(transactionCreated.status).toEqual(transaction.status);
      expect(transactionCreated.amount).toEqual(transaction.amount);
      expect(transactionCreated.orderId).toEqual(transaction.orderId);
    });
  });
});
