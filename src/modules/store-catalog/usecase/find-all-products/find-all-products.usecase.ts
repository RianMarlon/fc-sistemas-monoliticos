import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ProductGateway from "../../gateway/product.gateway";
import { FindAllProductsOutputDto } from "./find-all-products.dto";

export default class FindAllProductsUseCase implements UseCaseInterface {
  constructor(private _productRepository: ProductGateway) {}

  async execute(): Promise<FindAllProductsOutputDto> {
    const products = await this._productRepository.findAll();
    return {
      products: products.map((product) => ({
        id: product.id.value,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}
