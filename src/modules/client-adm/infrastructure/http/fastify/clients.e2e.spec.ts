import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import request from "supertest";
import { join } from "path";

import { migrator } from "../../../../../@shared/infrastructure/database/sequelize/migrator";
import fastifyServer from "../../../../../@shared/infrastructure/http/fastify";

describe("Clients e2e tests", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeAll(async () => {
    await fastifyServer.ready();
  });

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [join(__dirname, "../../../../**/*.model.ts")],
    });

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

  afterAll(async () => {
    await fastifyServer.close();
  });

  describe("[POST] /clients", () => {
    it("should create a client", async () => {
      const requestBody = {
        name: "Client Name 1",
        document: "Client Document 1",
        email: "test@test.com",
        street: "Street",
        number: "122",
        city: "City",
        state: "State",
        zipCode: "92829232",
      };
      const response = await request(fastifyServer.server)
        .post("/clients")
        .send(requestBody);
      const clientCreated = response.body;

      expect(response.status).toEqual(201);

      expect(clientCreated.id).toBeDefined();
      expect(clientCreated.name).toEqual(requestBody.name);
      expect(clientCreated.document).toEqual(requestBody.document);
      expect(clientCreated.email).toEqual(requestBody.email);
      expect(clientCreated.street).toEqual(requestBody.street);
      expect(clientCreated.number).toEqual(requestBody.number);
      expect(clientCreated.city).toEqual(requestBody.city);
      expect(clientCreated.state).toEqual(requestBody.state);
      expect(clientCreated.zipCode).toEqual(requestBody.zipCode);
    });
  });
});
