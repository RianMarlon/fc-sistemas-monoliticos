import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";

describe("ClientRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe("create", () => {
    it("should create a client", async () => {
      const client = new Client({
        id: "1",
        name: "Client 1",
        email: "test@test.com",
        address: "Address 1",
      });

      const repository = new ClientRepository();
      await repository.add(client);

      const clientDb = await ClientModel.findOne({ where: { id: "1" } });

      expect(clientDb).toBeDefined();
      expect(clientDb.id).toEqual(client.id.value);
      expect(clientDb.name).toEqual(client.name);
      expect(clientDb.email).toEqual(client.email);
      expect(clientDb.address).toEqual(client.address);
      expect(clientDb.createdAt).toEqual(client.createdAt);
      expect(clientDb.updatedAt).toEqual(client.updatedAt);
    });
  });

  describe("find", () => {
    it("should find a client", async () => {
      const client = await ClientModel.create({
        id: "1",
        name: "Client 1",
        email: "test@test.com",
        address: "Address 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const repository = new ClientRepository();
      const result = await repository.find(client.id);

      expect(result.id.value).toEqual(client.id);
      expect(result.name).toEqual(client.name);
      expect(result.email).toEqual(client.email);
      expect(result.address).toEqual(client.address);
      expect(result.createdAt).toEqual(client.createdAt);
      expect(result.updatedAt).toEqual(client.updatedAt);
    });

    it("should throw an error when the client not exists", async () => {
      const repository = new ClientRepository();
      await expect(repository.find("2")).rejects.toThrow();
    });
  });
});
