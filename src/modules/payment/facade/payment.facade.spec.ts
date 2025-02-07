import { Sequelize } from "sequelize-typescript";

import TransactionModel from "../repository/transaction.model";
import PaymentFacadeFactory from "../factory/payment.facade.factory";
import { ClientModel } from "../repository/client.model";
import OrderModel from "../repository/order.model";

describe("Paymentacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([TransactionModel, ClientModel, OrderModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe("create", () => {
    it("should create a transaction", async () => {
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

      const facade = PaymentFacadeFactory.create();

      const input = {
        orderId: "1",
        amount: 100,
      };

      const output = await facade.process(input);

      expect(output.transactionId).toBeDefined();
      expect(output.orderId).toEqual(input.orderId);
      expect(output.amount).toEqual(input.amount);
      expect(output.status).toEqual("approved");
    });
  });
});
