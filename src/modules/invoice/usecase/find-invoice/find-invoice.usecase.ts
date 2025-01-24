import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { InvoiceGateway } from "../../gateway/invoice.gateway";
import {
  FindInvoiceUseCaseInputDto,
  FindInvoiceUseCaseOutputDto,
} from "./find-invoice.usecase.dto";

export default class FindInvoiceUseCase implements UseCaseInterface {
  constructor(private _invoiceRepository: InvoiceGateway) {}

  async execute(
    input: FindInvoiceUseCaseInputDto
  ): Promise<FindInvoiceUseCaseOutputDto> {
    const invoice = await this._invoiceRepository.find(input.id);
    return {
      id: invoice.id.value,
      name: invoice.name,
      document: invoice.document,
      address: {
        number: invoice.address.number,
        street: invoice.address.street,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      items: invoice.items.map((item) => {
        return {
          id: item.id.value,
          name: item.name,
          price: item.price,
        };
      }),
      total: invoice.total,
      createdAt: invoice.createdAt,
    };
  }
}
