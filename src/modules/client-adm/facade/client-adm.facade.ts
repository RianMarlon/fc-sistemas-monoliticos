import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface, {
  AddClientFacadeInputDto,
  AddClientFacadeOutputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./client-adm.facade.interface";

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  constructor(
    private _addUseCase: UseCaseInterface,
    private _findUseCase: UseCaseInterface
  ) {}

  async add(input: AddClientFacadeInputDto): Promise<AddClientFacadeOutputDto> {
    return await this._addUseCase.execute(input);
  }

  async find(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    return await this._findUseCase.execute(input);
  }
}
