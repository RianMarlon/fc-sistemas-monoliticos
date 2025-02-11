import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";

describe("ClientAdmFacadeSpec test", () => {
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
      const facade = ClientAdmFacadeFactory.create();

      const input = {
        name: "Client 1",
        email: "test@test.com",
        document: "12345678900",
        street: "Street 1",
        number: "123",
        complement: "Apt 1",
        city: "City 1",
        state: "State 1",
        zipCode: "12345-678",
      };

      const clientCreated = await facade.add(input);

      const client = await ClientModel.findOne({
        where: {
          id: clientCreated.id,
        },
      });

      expect(client).toBeDefined();
      expect(client.name).toEqual(input.name);
      expect(client.email).toEqual(input.email);
      expect(client.document).toEqual(input.document);
      expect(client.street).toEqual(input.street);
      expect(client.number).toEqual(input.number);
      expect(client.complement).toEqual(input.complement);
      expect(client.city).toEqual(input.city);
      expect(client.state).toEqual(input.state);
      expect(client.zipCode).toEqual(input.zipCode);
    });
  });

  describe("find", () => {
    it("should find a client", async () => {
      const facade = ClientAdmFacadeFactory.create();

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

      const input = {
        id: "1",
      };

      const client = await facade.find({
        id: "1",
      });
      expect(client).toBeDefined();
      expect(client.id).toEqual(input.id);
      expect(client.name).toEqual("Client 1");
      expect(client.email).toEqual("test@test.com");
      expect(client.document).toEqual("12345678900");
      expect(client.street).toEqual("Street 1");
      expect(client.number).toEqual("123");
      expect(client.complement).toEqual("Apt 1");
      expect(client.city).toEqual("City 1");
      expect(client.state).toEqual("State 1");
      expect(client.zipCode).toEqual("12345-678");
    });
  });
});
