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
    let total = 0;
    const items = invoice.items.map((item) => {
      total += item.price;
      return {
        id: item.id.value,
        name: item.name,
        price: item.price,
      };
    });

    return {
      id: invoice.id.value,
      name: invoice.name,
      document: invoice.document,
      address: invoice.address,
      items: items,
      total: total,
      createdAt: invoice.createdAt,
    };
  }
}
