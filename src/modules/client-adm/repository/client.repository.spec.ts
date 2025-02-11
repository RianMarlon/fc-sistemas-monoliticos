import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import { Umzug } from "umzug";
import { migrator } from "../../../@shared/infrastructure/database/sequelize/migrator";

describe("ClientRepository test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);
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

  describe("create", () => {
    it("should create a client", async () => {
      const client = new Client({
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

      const repository = new ClientRepository();
      await repository.add(client);

      const clientDb = await ClientModel.findOne({ where: { id: "1" } });

      expect(clientDb).toBeDefined();
      expect(clientDb.id).toEqual(client.id.value);
      expect(clientDb.name).toEqual(client.name);
      expect(clientDb.email).toEqual(client.email);
      expect(clientDb.document).toEqual(client.document);
      expect(clientDb.street).toEqual(client.street);
      expect(clientDb.number).toEqual(client.number);
      expect(clientDb.complement).toEqual(client.complement);
      expect(clientDb.city).toEqual(client.city);
      expect(clientDb.state).toEqual(client.state);
      expect(clientDb.zipCode).toEqual(client.zipCode);
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

      const repository = new ClientRepository();
      const result = await repository.find(client.id);

      expect(result.id.value).toEqual(client.id);
      expect(result.name).toEqual(client.name);
      expect(result.email).toEqual(client.email);
      expect(result.document).toEqual(client.document);
      expect(result.street).toEqual(client.street);
      expect(result.number).toEqual(client.number);
      expect(result.complement).toEqual(client.complement);
      expect(result.city).toEqual(client.city);
      expect(result.state).toEqual(client.state);
      expect(result.zipCode).toEqual(client.zipCode);
      expect(result.createdAt).toEqual(client.createdAt);
      expect(result.updatedAt).toEqual(client.updatedAt);
    });

    it("should throw an error when the client not exists", async () => {
      const repository = new ClientRepository();
      await expect(repository.find("2")).rejects.toThrow("Client not found");
    });
  });
});
