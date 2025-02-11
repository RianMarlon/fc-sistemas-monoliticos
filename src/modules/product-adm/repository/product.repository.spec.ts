import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";

import ProductModel from "./product.model";
import Product from "../domain/product.entity";
import ProductRepository from "./product.repository";
import { migrator } from "../../../@shared/infrastructure/database/sequelize/migrator";

describe("ProductRepository test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
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

  describe("create", () => {
    it("should create a product", async () => {
      const productProps = {
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const product = new Product(productProps);
      const productRepository = new ProductRepository();
      await productRepository.add(product);

      const productDb = await ProductModel.findOne({
        where: {
          id: productProps.id,
        },
      });

      expect(productDb.id).toEqual(productProps.id);
      expect(productDb.name).toEqual(productProps.name);
      expect(productDb.description).toEqual(productProps.description);
      expect(productDb.purchasePrice).toEqual(productProps.purchasePrice);
      expect(productDb.stock).toEqual(productProps.stock);
    });
  });

  describe("find", () => {
    it("should find a product", async () => {
      const productRepository = new ProductRepository();
      await ProductModel.create({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const product = await productRepository.find("1");
      expect(product.id.value).toEqual("1");
      expect(product.name).toEqual("Product 1");
      expect(product.description).toEqual("Product 1 description");
      expect(product.purchasePrice).toEqual(100);
      expect(product.stock).toEqual(10);
    });

    it("should throw an error when the product not exists", async () => {
      const productRepository = new ProductRepository();
      await expect(productRepository.find("1")).rejects.toThrow();
    });
  });
});
