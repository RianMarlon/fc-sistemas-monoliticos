import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import { join } from "path";

import { migrator } from "../../../../../../@shared/infrastructure/database/sequelize/migrator";

import InvoiceItemModel from "../../../../repository/invoice-item.model";
import InvoiceAddressModel from "../../../../repository/invoice-address.model";
import fastifyServer from "../../../../../../@shared/infrastructure/http/fastify";
import ProductModel from "../../../../repository/product.model";
import Id from "../../../../../../@shared/domain/value-object/id.value-object";
import InvoiceModel from "../../../../repository/invoice.model";

describe("Invoice e2e tests", () => {
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

  describe("[GET] /invoices/:invoiceId", () => {
    it("should return a invoice", async () => {
      const productCreated1 = await ProductModel.create({
        id: "1",
        name: "Teste",
        description: "Teste",
        salesPrice: 300,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const productCreated2 = await ProductModel.create({
        id: "2",
        name: "Teste 2",
        description: "Teste 2",
        salesPrice: 500,
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const invoiceCreated = await InvoiceModel.create(
        {
          id: "d09dbd03-a6ea-4264-a60b-5be6fced832e",
          name: "Teste",
          document: "Document",
          address: {
            id: "3054c860-20bf-4f75-9d71-a3234f1f3274",
            number: "2322",
            street: "Street 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12333",
            createdAt: new Date(),
          },
          invoiceItems: [
            {
              id: new Id().value,
              productId: productCreated1.id,
            },
            {
              id: new Id().value,
              productId: productCreated2.id,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          include: [InvoiceAddressModel, InvoiceItemModel, ProductModel],
        }
      );

      const response = await request(fastifyServer.server).get(
        "/invoices/d09dbd03-a6ea-4264-a60b-5be6fced832e"
      );

      expect(response.status).toEqual(200);

      const invoiceReturned = response.body;
      expect(invoiceReturned.id).toEqual(invoiceCreated.id);
      expect(invoiceReturned.name).toEqual(invoiceCreated.name);
      expect(invoiceReturned.document).toEqual(invoiceCreated.document);

      expect(invoiceReturned.address.number).toEqual(
        invoiceCreated.address.number
      );
      expect(invoiceReturned.address.street).toEqual(
        invoiceCreated.address.street
      );
      expect(invoiceReturned.address.city).toEqual(invoiceCreated.address.city);
      expect(invoiceReturned.address.state).toEqual(
        invoiceCreated.address.state
      );
      expect(invoiceReturned.address.zipCode).toEqual(
        invoiceCreated.address.zipCode
      );

      expect(invoiceReturned.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: productCreated1.id,
            name: productCreated1.name,
            price: productCreated1.salesPrice,
          }),
        ])
      );
      expect(invoiceReturned.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: productCreated2.id,
            name: productCreated2.name,
            price: productCreated2.salesPrice,
          }),
        ])
      );
    });

    it("should return an error message when the invoice not found", async () => {
      const response = await request(fastifyServer.server).get(
        "/invoices/ce8320ca-809f-44c3-97b7-a2c9668d4839"
      );

      expect(response.status).toEqual(500);
      expect(response.body.message).toEqual("Invoice not found");
    });
  });
});
