import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";

import InvoiceAddressModel from "./invoice-address.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import { InvoiceRepository } from "./invoice.repository";
import Invoice from "../domain/invoice.entity";
import Address from "../domain/address.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import { migrator } from "../../../@shared/infrastructure/database/sequelize/migrator";
import ProductModel from "./product.model";
import Id from "../../../@shared/domain/value-object/id.value-object";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([
      InvoiceModel,
      InvoiceItemModel,
      InvoiceAddressModel,
      ProductModel,
    ]);
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

  describe("find", () => {
    it("should find an invoice", async () => {
      const productCreated1 = await ProductModel.create({
        id: "1",
        name: "Teste",
        description: "Teste",
        salesPrice: 866,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const productCreated2 = await ProductModel.create({
        id: "2",
        name: "Teste 2",
        description: "Teste 2",
        salesPrice: 83,
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const invoiceRepository = new InvoiceRepository();
      const invoiceProps = {
        id: "1",
        name: "Invoice",
        document: "39823992",
        address: {
          id: "1",
          number: "2982",
          street: "Street",
          complement: "Complement",
          city: "City",
          state: "State",
          zipCode: "22983",
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
      };
      await InvoiceModel.create(invoiceProps, {
        include: [InvoiceItemModel, InvoiceAddressModel, ProductModel],
      });

      const invoice = await invoiceRepository.find("1");

      expect(invoice.id.value).toEqual(invoiceProps.id);
      expect(invoice.name).toEqual(invoiceProps.name);
      expect(invoice.document).toEqual(invoiceProps.document);
      expect(invoice.address.number).toEqual(invoiceProps.address.number);
      expect(invoice.address.street).toEqual(invoiceProps.address.street);
      expect(invoice.address.complement).toEqual(
        invoiceProps.address.complement
      );
      expect(invoice.address.city).toEqual(invoiceProps.address.city);
      expect(invoice.address.state).toEqual(invoiceProps.address.state);
      expect(invoice.address.zipCode).toEqual(invoiceProps.address.zipCode);

      expect(invoice.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining(
            new InvoiceItem({
              id: productCreated1.id,
              name: productCreated1.name,
              price: productCreated1.salesPrice,
              createdAt: productCreated1.createdAt,
              updatedAt: productCreated1.updatedAt,
            })
          ),
        ])
      );
      expect(invoice.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining(
            new InvoiceItem({
              id: productCreated2.id,
              name: productCreated2.name,
              price: productCreated2.salesPrice,
              createdAt: productCreated2.createdAt,
              updatedAt: productCreated2.updatedAt,
            })
          ),
        ])
      );
    });

    it("should throw an error when the invoice not exists", async () => {
      const invoiceRepository = new InvoiceRepository();
      await expect(invoiceRepository.find("2")).rejects.toThrow();
    });
  });

  describe("generate", () => {
    it("should generate an invoice", async () => {
      const productCreated1 = await ProductModel.create({
        id: "1",
        name: "Teste",
        description: "Teste",
        salesPrice: 866,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const productCreated2 = await ProductModel.create({
        id: "2",
        name: "Teste",
        description: "Teste",
        salesPrice: 866,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const invoiceRepository = new InvoiceRepository();
      const invoice = new Invoice({
        id: "2",
        name: "Invoice 2",
        document: "65756756",
        address: new Address({
          number: "4223",
          street: "Street 2",
          complement: "Complement 2",
          city: "City 2",
          state: "State 2",
          zipCode: "42322",
        }),
        items: [
          new InvoiceItem({
            id: productCreated1.id,
            name: productCreated1.name,
            price: productCreated1.salesPrice,
            createdAt: productCreated1.createdAt,
            updatedAt: productCreated1.updatedAt,
          }),
          new InvoiceItem({
            id: productCreated2.id,
            name: productCreated2.name,
            price: productCreated2.salesPrice,
            createdAt: productCreated2.createdAt,
            updatedAt: productCreated2.updatedAt,
          }),
        ],
      });

      await invoiceRepository.generate(invoice);

      const invoiceCreated = await InvoiceModel.findOne({
        include: [InvoiceItemModel, InvoiceAddressModel, ProductModel],
      });

      expect(invoice.id.value).toEqual(invoiceCreated?.id);
      expect(invoice.name).toEqual(invoiceCreated?.name);
      expect(invoice.document).toEqual(invoiceCreated?.document);
      expect(invoice.address.number).toEqual(invoiceCreated?.address.number);
      expect(invoice.address.street).toEqual(invoiceCreated?.address.street);
      expect(invoice.address.complement).toEqual(
        invoiceCreated?.address.complement
      );
      expect(invoice.address.city).toEqual(invoiceCreated?.address.city);
      expect(invoice.address.state).toEqual(invoiceCreated?.address.state);
      expect(invoice.address.zipCode).toEqual(invoiceCreated?.address.zipCode);

      expect(invoice.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining(
            new InvoiceItem({
              id: productCreated1.id,
              name: productCreated1.name,
              price: productCreated1.salesPrice,
              createdAt: productCreated1.createdAt,
              updatedAt: productCreated1.updatedAt,
            })
          ),
        ])
      );
      expect(invoice.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining(
            new InvoiceItem({
              id: productCreated2.id,
              name: productCreated2.name,
              price: productCreated2.salesPrice,
              createdAt: productCreated2.createdAt,
              updatedAt: productCreated2.updatedAt,
            })
          ),
        ])
      );
    });
  });
});
