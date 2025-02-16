import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import StoreCatalogFacadeFactory from "../factory/facade.factory";

describe("StoreCatalogFacade test", () => {
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

  describe("find", () => {
    it("should find a product", async () => {
      const facade = StoreCatalogFacadeFactory.create();
      await ProductModel.create({
        id: "1",
        name: "Product 1",
        description: "Description 1",
        salesPrice: 100,
        stock: 28,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await facade.find({
        id: "1",
      });

      expect(result.id).toBe("1");
      expect(result.name).toBe("Product 1");
      expect(result.description).toBe("Description 1");
      expect(result.salesPrice).toBe(100);
      expect(result.stock).toBe(28);
    });
  });

  describe("findAll", () => {
    it("should find all products", async () => {
      const facade = StoreCatalogFacadeFactory.create();
      await ProductModel.create({
        id: "1",
        name: "Product 1",
        description: "Description 1",
        salesPrice: 100,
        stock: 32,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await ProductModel.create({
        id: "2",
        name: "Product 2",
        description: "Description 2",
        salesPrice: 200,
        stock: 56,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await facade.findAll();

      expect(result.products.length).toBe(2);
      expect(result.products[0].id).toBe("1");
      expect(result.products[0].name).toBe("Product 1");
      expect(result.products[0].description).toBe("Description 1");
      expect(result.products[0].salesPrice).toBe(100);
      expect(result.products[0].stock).toBe(32);
      expect(result.products[1].id).toBe("2");
      expect(result.products[1].name).toBe("Product 2");
      expect(result.products[1].description).toBe("Description 2");
      expect(result.products[1].salesPrice).toBe(200);
      expect(result.products[1].stock).toBe(56);
    });
  });
});
