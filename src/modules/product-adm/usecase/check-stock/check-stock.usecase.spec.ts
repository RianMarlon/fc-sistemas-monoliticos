import Product from "../../domain/product.entity";
import CheckStockUseCase from "./check-stock.usecase";

const product = new Product({
  name: "Product 1",
  description: "Product 1 description",
  stock: 5,
  purchasePrice: 32,
});
const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockImplementation(async () => product),
  };
};

describe("Check stock usecase unit test", () => {
  it("should return the product stock by id", async () => {
    const productRepository = MockRepository();
    const usecase = new CheckStockUseCase(productRepository);

    const input = {
      productId: product.id.value,
    };
    const result = await usecase.execute(input);

    expect(result.productId).toEqual(product.id.value);
    expect(result.stock).toEqual(5);
  });
});
