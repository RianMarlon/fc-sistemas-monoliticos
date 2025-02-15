import { Sequelize } from "sequelize-typescript";

import InvoiceAddressModel from "../repository/invoice-address.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";
import { InvoiceFacadeFactory } from "../factory/invoice.facade.factory";
import ProductModel from "../repository/product.model";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item.entity";

describe("InvoiceFacade test ", () => {
  let sequelize: Sequelize;

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
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe("findInvoice", () => {
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
      const invoiceFacade = InvoiceFacadeFactory.create();

      const input = {
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
      await InvoiceModel.create(input, {
        include: [InvoiceItemModel, InvoiceAddressModel, ProductModel],
      });

      const result = await invoiceFacade.findInvoice({
        id: "1",
      });
      expect(result.id).toEqual(input.id);
      expect(result.name).toEqual(input.name);
      expect(result.document).toEqual(input.document);
      expect(result.address.number).toEqual(input.address.number);
      expect(result.address.street).toEqual(input.address.street);
      expect(result.address.complement).toEqual(input.address.complement);
      expect(result.address.city).toEqual(input.address.city);
      expect(result.address.state).toEqual(input.address.state);
      expect(result.address.zipCode).toEqual(input.address.zipCode);
      expect(result.items).toEqual(
        expect.arrayContaining([
          {
            id: productCreated1.id,
            name: productCreated1.name,
            price: productCreated1.salesPrice,
          },
        ])
      );
      expect(result.items).toEqual(
        expect.arrayContaining([
          {
            id: productCreated2.id,
            name: productCreated2.name,
            price: productCreated2.salesPrice,
          },
        ])
      );
      expect(result.total).toEqual(949);
    });
  });

  describe("generate", () => {
    it("should generate an invoice", async () => {
      const productCreated1 = await ProductModel.create({
        id: "1",
        name: "Teste",
        description: "Teste",
        salesPrice: 500,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const productCreated2 = await ProductModel.create({
        id: "2",
        name: "Teste 2",
        description: "Teste 2",
        salesPrice: 700,
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const invoiceFacade = InvoiceFacadeFactory.create();

      const input = {
        name: "Invoice 1",
        document: "9392",
        street: "Street",
        number: "120",
        complement: "",
        city: "City",
        state: "State",
        zipCode: "294892",
        items: [
          {
            id: productCreated1.id,
            name: productCreated1.name,
            price: productCreated1.salesPrice,
          },
          {
            id: productCreated2.id,
            name: productCreated2.name,
            price: productCreated2.salesPrice,
          },
        ],
      };
      const result = await invoiceFacade.generateInvoice(input);
      expect(result.name).toEqual(input.name);
      expect(result.document).toEqual(input.document);
      expect(result.number).toEqual(input.number);
      expect(result.street).toEqual(input.street);
      expect(result.complement).toEqual(input.complement);
      expect(result.city).toEqual(input.city);
      expect(result.state).toEqual(input.state);
      expect(result.zipCode).toEqual(input.zipCode);
      expect(result.items[0].id).toEqual(input.items[0].id);
      expect(result.items[0].name).toEqual(input.items[0].name);
      expect(result.items[0].price).toEqual(input.items[0].price);
      expect(result.items[1].id).toEqual(input.items[1].id);
      expect(result.items[1].name).toEqual(input.items[1].name);
      expect(result.items[1].price).toEqual(input.items[1].price);
      expect(result.total).toEqual(1200);
    });
  });
});
