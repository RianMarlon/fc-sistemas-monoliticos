import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
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

  it("should create a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

    const input = {
      name: "Client 1",
      email: "test@test.com",
      address: "Address 1",
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
    expect(client.address).toEqual(input.address);
  });

  it("should find a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

    await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "test@test.com",
      address: "Address 1",
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
    expect(client.name).toEqual(client.name);
    expect(client.email).toEqual(client.email);
    expect(client.address).toEqual(client.address);
  });
});
