import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
  name: "Client 1",
  email: "test@test.com",
  document: "12345678900",
  street: "Street 1",
  number: "123",
  complement: "Apt 1",
  city: "City 1",
  state: "State 1",
  zipCode: "12345-678",
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockResolvedValue(client),
  };
};

describe("Find client usecase unit test", () => {
  it("should find a client", async () => {
    const repository = MockRepository();
    const usecase = new FindClientUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(client.id.value);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.document).toEqual(client.document);
    expect(result.street).toEqual(client.street);
    expect(result.number).toEqual(client.number);
    expect(result.complement).toEqual(client.complement);
    expect(result.city).toEqual(client.city);
    expect(result.state).toEqual(client.state);
    expect(result.zipCode).toEqual(client.zipCode);
  });
});
