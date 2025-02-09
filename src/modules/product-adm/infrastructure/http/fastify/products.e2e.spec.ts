import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import request from "supertest";

import { migrator } from "../../../../../@shared/infrastructure/database/sequelize/migrator";
import fastifyServer from "../../../../../@shared/infrastructure/http/fastify";
import { ProductModel } from "../../../repository/product.model";

describe("Products e2e tests", () => {
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
    });

    sequelize.addModels([ProductModel]);
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

  describe("[POST] /products", () => {
    it("should create a product", async () => {
      const requestBody = {
        name: "Product 1",
        description: "Description 1",
        purchasePrice: 100,
        stock: 12,
      };
      const response = await request(fastifyServer.server)
        .post("/products")
        .send(requestBody);
      const productCreated = response.body;

      expect(response.status).toEqual(201);

      expect(productCreated.id).toBeDefined();
      expect(productCreated.name).toEqual(productCreated.name);
      expect(productCreated.description).toEqual(productCreated.description);
      expect(productCreated.purchasePrice).toEqual(
        productCreated.purchasePrice
      );
      expect(productCreated.stock).toEqual(productCreated.stock);
    });
  });
});
