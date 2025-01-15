import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import StoreCatalogFacadeInterface, {
  FindAllStoreCatalogFacadeOutputDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogFacadeOutputDto,
} from "./store-catalog.facade.interface";

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  constructor(
    private _findUseCase: FindProductUseCase,
    private _findAllUseCase: FindAllProductsUseCase
  ) {}

  async find(
    input: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto> {
    return await this._findUseCase.execute({
      id: input.id,
    });
  }

  async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    return await this._findAllUseCase.execute();
  }
}
