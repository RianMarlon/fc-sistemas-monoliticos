import Address from "../../domain/address.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoiceItem1 = new InvoiceItem({
  name: "Invoice item 1",
  price: 90,
});

const invoiceItem2 = new InvoiceItem({
  name: "Invoice item 2",
  price: 76,
});

const invoice = new Invoice({
  name: "Invoice",
  document: "document",
  address: new Address({
    street: "Street",
    number: "129",
    complement: "Teste",
    city: "City",
    state: "State",
    zipcode: "928392",
  }),
  items: [invoiceItem1, invoiceItem2],
});

const MockRepository = () => {
  return {
    find: jest.fn().mockResolvedValue(invoice),
    generate: jest.fn(),
  };
};

describe("Find invoice usecase unit tests", () => {
  it("should find a invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "1",
    };
    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(invoice.id.value);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address).toEqual(invoice.address);
    expect(result.items[0].id).toEqual(invoice.items[0].id.value);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.items[1].id).toEqual(invoice.items[1].id.value);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
    expect(result.total).toEqual(166);
    expect(result.createdAt).toEqual(invoice.createdAt);
  });
});
