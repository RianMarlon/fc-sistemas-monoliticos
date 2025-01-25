import { Sequelize } from "sequelize-typescript";
import InvoiceAddressModel from "../repository/invoice-address.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";
import { InvoiceRepository } from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import { InvoiceFacade } from "./invoice.facade";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

describe("InvoiceFacade test ", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel, InvoiceAddressModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find an invoice", async () => {
    const repository = new InvoiceRepository();
    const findInvoiceUsecase = new FindInvoiceUseCase(repository);
    const invoiceFacade = new InvoiceFacade(findInvoiceUsecase, null);

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

    const result = await invoiceFacade.findInvoice({
      id: "1",
    });
    expect(result.id).toEqual(invoiceProps.id);
    expect(result.name).toEqual(invoiceProps.name);
    expect(result.document).toEqual(invoiceProps.document);
    expect(result.address.number).toEqual(invoiceProps.address.number);
    expect(result.address.street).toEqual(invoiceProps.address.street);
    expect(result.address.complement).toEqual(invoiceProps.address.complement);
    expect(result.address.city).toEqual(invoiceProps.address.city);
    expect(result.address.state).toEqual(invoiceProps.address.state);
    expect(result.address.zipCode).toEqual(invoiceProps.address.zipCode);
    expect(result.items[0].id).toEqual(invoiceProps.items[0].id);
    expect(result.items[0].name).toEqual(invoiceProps.items[0].name);
    expect(result.items[0].price).toEqual(invoiceProps.items[0].price);
    expect(result.items[1].id).toEqual(invoiceProps.items[1].id);
    expect(result.items[1].name).toEqual(invoiceProps.items[1].name);
    expect(result.items[1].price).toEqual(invoiceProps.items[1].price);
    expect(result.total).toEqual(292);
  });

  it("should generate an invoice", async () => {
    const repository = new InvoiceRepository();
    const generateInvoiceUsecase = new GenerateInvoiceUseCase(repository);
    const invoiceFacade = new InvoiceFacade(null, generateInvoiceUsecase);

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
          id: "292",
          name: "Item 1",
          price: 200,
        },
        {
          id: "633",
          name: "Item 2",
          price: 3400,
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
    expect(result.total).toEqual(3600);
  });
});
