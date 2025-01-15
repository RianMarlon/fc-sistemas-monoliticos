import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {
  async findAll(): Promise<Product[]> {
    const products = await ProductModel.findAll();
    return products.map(
      (product) =>
        new Product({
          id: product.id,
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        })
    );
  }
  async find(id: string): Promise<Product> {
    const product = await ProductModel.findOne({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    return new Product({
      id: product.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}
