import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    find: jest.fn(),
    generate: jest.fn(),
  };
};

describe("Generate invoice usecase unit tests", () => {
  it("should generate an invoice", async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

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
    const result = await usecase.execute(input);

    expect(repository.generate).toHaveBeenCalled();
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.street).toEqual(input.street);
    expect(result.number).toEqual(input.number);
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
