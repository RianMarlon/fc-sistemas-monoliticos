import ClientGateway from "../../gateway/client.gateway";
import {
  FindClientInputDto,
  FindClientOutputDto,
} from "./find-client.usecase.dto";

export default class FindClientUseCase {
  constructor(private _clientRepository: ClientGateway) {}

  async execute(input: FindClientInputDto): Promise<FindClientOutputDto> {
    const result = await this._clientRepository.find(input.id);

    return {
      id: result.id.value,
      name: result.name,
      email: result.email,
      address: result.address,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
