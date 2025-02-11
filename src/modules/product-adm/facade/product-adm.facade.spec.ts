import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import ProductAdmFacadeFactory from "../factory/facade.factory";

describe("ProductAdmFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe("addProduct", () => {
    it("should create a product", async () => {
      const productFacade = ProductAdmFacadeFactory.create();

      const input = {
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 10,
        stock: 10,
      };
      const result = await productFacade.addProduct(input);

      const product = await ProductModel.findOne({
        where: {
          id: result.id,
        },
      });
      expect(product).toBeDefined();
      expect(product.id).toBe(result.id);
      expect(product.name).toBe(input.name);
      expect(product.description).toBe(input.description);
      expect(product.purchasePrice).toBe(input.purchasePrice);
      expect(product.stock).toBe(input.stock);
    });
  });

  describe("checkStock", () => {
    it("should check product stock", async () => {
      const productFacade = ProductAdmFacadeFactory.create();

      await ProductModel.create({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        stock: 12,
        purchasePrice: 63,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await productFacade.checkStock({
        productId: "1",
      });
      expect(result.productId).toEqual("1");
      expect(result.stock).toEqual(12);
    });
  });
});
