import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add client usecase unit test", () => {
  it("should add a client", async () => {
    const repository = MockRepository();
    const usecase = new AddClientUseCase(repository);

    const input = {
      name: "Client 1",
      email: "test@test.com",
      document: "document",
      street: "Street 1",
      number: "231",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "9222",
    };

    const result = await usecase.execute(input);
    expect(repository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.document).toEqual(input.document);
    expect(result.street).toEqual(input.street);
    expect(result.number).toEqual(input.number);
    expect(result.complement).toEqual(input.complement);
    expect(result.city).toEqual(input.city);
    expect(result.state).toEqual(input.state);
    expect(result.zipCode).toEqual(input.zipCode);
  });
});
