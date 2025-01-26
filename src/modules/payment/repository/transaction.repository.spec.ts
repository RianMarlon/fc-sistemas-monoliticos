import { Sequelize } from "sequelize-typescript";
import TransactionModel from "./transaction.model";
import Transaction from "../domain/transaction";
import TransactionRepository from "./transaction.repository";

describe("TransactionRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe("save", () => {
    it("should save a transaction", async () => {
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
