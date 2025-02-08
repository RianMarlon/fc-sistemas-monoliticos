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

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel, InvoiceAddressModel]);
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
        items: [
          {
            id: "1",
            name: "Item 1",
            price: 82,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            name: "Item 2",
            price: 210,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await InvoiceModel.create(invoiceProps, {
        include: [InvoiceItemModel, InvoiceAddressModel],
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
      expect(invoice.items[0].id.value).toEqual(invoiceProps.items[0].id);
      expect(invoice.items[0].name).toEqual(invoiceProps.items[0].name);
      expect(invoice.items[0].price).toEqual(invoiceProps.items[0].price);
      expect(invoice.items[1].id.value).toEqual(invoiceProps.items[1].id);
      expect(invoice.items[1].name).toEqual(invoiceProps.items[1].name);
      expect(invoice.items[1].price).toEqual(invoiceProps.items[1].price);
    });

    it("should throw an error when the invoice not exists", async () => {
      const invoiceRepository = new InvoiceRepository();
      await expect(invoiceRepository.find("2")).rejects.toThrow();
    });
  });

  describe("generate", () => {
    it("should generate an invoice", async () => {
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
            name: "Item 3",
            price: 422,
          }),
          new InvoiceItem({
            name: "Item 4",
            price: 1232,
          }),
        ],
      });

      await invoiceRepository.generate(invoice);

      const invoiceCreated = await InvoiceModel.findOne({
        include: [InvoiceItemModel, InvoiceAddressModel],
      });

      expect(invoice.id.value).toEqual(invoiceCreated.id);
      expect(invoice.name).toEqual(invoiceCreated.name);
      expect(invoice.document).toEqual(invoiceCreated.document);
      expect(invoice.address.number).toEqual(invoiceCreated.address.number);
      expect(invoice.address.street).toEqual(invoiceCreated.address.street);
      expect(invoice.address.complement).toEqual(
        invoiceCreated.address.complement
      );
      expect(invoice.address.city).toEqual(invoiceCreated.address.city);
      expect(invoice.address.state).toEqual(invoiceCreated.address.state);
      expect(invoice.address.zipCode).toEqual(invoiceCreated.address.zipCode);
      expect(invoice.items[0].id.value).toEqual(invoiceCreated.items[0].id);
      expect(invoice.items[0].name).toEqual(invoiceCreated.items[0].name);
      expect(invoice.items[0].price).toEqual(invoiceCreated.items[0].price);
      expect(invoice.items[1].id.value).toEqual(invoiceCreated.items[1].id);
      expect(invoice.items[1].name).toEqual(invoiceCreated.items[1].name);
      expect(invoice.items[1].price).toEqual(invoiceCreated.items[1].price);
    });
  });
});
