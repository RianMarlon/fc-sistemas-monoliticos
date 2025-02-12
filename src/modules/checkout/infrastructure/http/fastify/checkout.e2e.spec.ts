import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import request from "supertest";
import { join } from "path";

import { migrator } from "../../../../../@shared/infrastructure/database/sequelize/migrator";
import fastifyServer from "../../../../../@shared/infrastructure/http/fastify";

import ClientModel from "../../../repository/client.model";
import ProductModel from "../../../repository/product.model";

describe("Checkout e2e tests", () => {
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

  describe("[POST] /checkout", () => {
    it("should create a checkout", async () => {
      const clientCreated = await ClientModel.create({
        id: "4cfc9b00-7c44-4572-91b4-4509b54161b7",
        name: "Client 1",
        document: "Document 1",
        email: "client@client.com",
        number: "32",
        street: "Street",
        city: "City",
        state: "State",
        zipCode: "2434232",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const productCreated1 = await ProductModel.create({
        id: "715a370f-36a9-49a5-a2fe-531a8ef02f17",
        name: "Product 1",
        description: "Description 1",
        salesPrice: 320,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const productCreated2 = await ProductModel.create({
        id: "99e4101d-6a36-43ba-9750-70734dccc43d",
        name: "Product 2",
        description: "Description 2",
        salesPrice: 920,
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const requestBody = {
        clientId: clientCreated.id,
        products: [
          { productId: productCreated1.id },
          { productId: productCreated2.id },
        ],
      };
      const response = await request(fastifyServer.server)
        .post("/checkout")
        .send(requestBody);
      const checkoutCreated = response.body;

      expect(response.status).toEqual(201);

      expect(checkoutCreated.id).toBeDefined();
      expect(checkoutCreated.invoiceId).toBeDefined();
      expect(checkoutCreated.status).toEqual("approved");
      expect(checkoutCreated.total).toEqual(1240);
      expect(checkoutCreated.products).toEqual(
        expect.arrayContaining([{ productId: productCreated1.id }])
      );
      expect(checkoutCreated.products).toEqual(
        expect.arrayContaining([{ productId: productCreated2.id }])
      );
    });

    it("should not generate the invoice if the payment is not approved", async () => {
      const clientCreated = await ClientModel.create({
        id: "4cfc9b00-7c44-4572-91b4-4509b54161b7",
        name: "Client 1",
        document: "Document 1",
        email: "client@client.com",
        number: "32",
        street: "Street",
        city: "City",
        state: "State",
        zipCode: "2434232",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const productCreated1 = await ProductModel.create({
        id: "f241b069-349a-4e16-ac75-caeaf550f6c1",
        name: "Product 1",
        description: "Description 1",
        salesPrice: 1,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const productCreated2 = await ProductModel.create({
        id: "10efbd3f-ee4b-4ee0-82ba-bf93f676bf94",
        name: "Product 2",
        description: "Description 2",
        salesPrice: 1,
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const requestBody = {
        clientId: clientCreated.id,
        products: [
          { productId: productCreated1.id },
          { productId: productCreated2.id },
        ],
      };
      const response = await request(fastifyServer.server)
        .post("/checkout")
        .send(requestBody);
      const checkoutCreated = response.body;

      expect(response.status).toEqual(201);
      expect(checkoutCreated.id).toBeDefined();
      expect(checkoutCreated.invoiceId).toBeNull();
      expect(checkoutCreated.status).toEqual("pending");
      expect(checkoutCreated.total).toEqual(2);
      expect(checkoutCreated.products).toEqual(
        expect.arrayContaining([{ productId: productCreated1.id }])
      );
      expect(checkoutCreated.products).toEqual(
        expect.arrayContaining([{ productId: productCreated2.id }])
      );
    });

    it("should throw an error if the client not found", async () => {
      const productCreated1 = await ProductModel.create({
        id: "f241b069-349a-4e16-ac75-caeaf550f6c1",
        name: "Product 1",
        description: "Description 1",
        salesPrice: 320,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const productCreated2 = await ProductModel.create({
        id: "10efbd3f-ee4b-4ee0-82ba-bf93f676bf94",
        name: "Product 2",
        description: "Description 2",
        salesPrice: 920,
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const requestBody = {
        clientId: "ab5219fb-02b8-44d0-bada-d5ac5b30a1a2",
        products: [
          { productId: productCreated1.id },
          { productId: productCreated2.id },
        ],
      };
      const response = await request(fastifyServer.server)
        .post("/checkout")
        .send(requestBody);

      expect(response.status).toEqual(500);
      expect(response.body.message).toEqual("Client not found");
    });

    it("should throw an error if no products is selected", async () => {
      const clientCreated = await ClientModel.create({
        id: "60154abd-9edf-4508-800e-8d0f0b401909",
        name: "Client 1",
        document: "Document 1",
        email: "client@client.com",
        number: "32",
        street: "Street",
        city: "City",
        state: "State",
        zipCode: "2434232",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const requestBody = {
        clientId: clientCreated.id,
        products: [] as any[],
      };

      const response = await request(fastifyServer.server)
        .post("/checkout")
        .send(requestBody);

      expect(response.statusCode).toEqual(500);
      expect(response.body.message).toEqual("No products selected");
    });

    it("should throw an error if a product not exists", async () => {
      const clientCreated = await ClientModel.create({
        id: "4cfc9b00-7c44-4572-91b4-4509b54161b7",
        name: "Client 1",
        document: "Document 1",
        email: "client@client.com",
        number: "32",
        street: "Street",
        city: "City",
        state: "State",
        zipCode: "2434232",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const requestBody = {
        clientId: clientCreated.id,
        products: [{ productId: "1bd77466-b5ef-4ca5-96ef-f26c8ded7d7e" }],
      };
      const response = await request(fastifyServer.server)
        .post("/checkout")
        .send(requestBody);

      expect(response.status).toEqual(500);
      expect(response.body.message).toEqual(
        "Product with id 1bd77466-b5ef-4ca5-96ef-f26c8ded7d7e not found"
      );
    });

    it("should throw an error if the product stock is not available", async () => {
      const clientCreated = await ClientModel.create({
        id: "4cfc9b00-7c44-4572-91b4-4509b54161b7",
        name: "Client 1",
        document: "Document 1",
        email: "client@client.com",
        number: "32",
        street: "Street",
        city: "City",
        state: "State",
        zipCode: "2434232",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const productCreated1 = await ProductModel.create({
        id: "715a370f-36a9-49a5-a2fe-531a8ef02f17",
        name: "Product 1",
        description: "Description 1",
        salesPrice: 320,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const productCreated2 = await ProductModel.create({
        id: "99e4101d-6a36-43ba-9750-70734dccc43d",
        name: "Product 2",
        description: "Description 2",
        salesPrice: 920,
        stock: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const requestBody = {
        clientId: clientCreated.id,
        products: [
          { productId: productCreated1.id },
          { productId: productCreated2.id },
        ],
      };
      const response = await request(fastifyServer.server)
        .post("/checkout")
        .send(requestBody);

      expect(response.status).toEqual(500);
      expect(response.body.message).toEqual(
        "Product 99e4101d-6a36-43ba-9750-70734dccc43d is not available in stock"
      );
    });
  });
});
