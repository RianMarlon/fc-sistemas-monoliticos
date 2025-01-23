import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Address from "../../domain/address.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import { InvoiceGateway } from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
  constructor(private _invoiceRepository: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address: new Address({
        number: input.number,
        street: input.street,
        complement: input.complement,
        city: input.city,
        state: input.state,
        zipcode: input.zipCode,
      }),
      items: input.items.map(
        (item) =>
          new InvoiceItem({
            id: item.id,
            name: item.name,
            price: item.price,
          })
      ),
    });

    await this._invoiceRepository.generate(invoice);

    return {
      id: invoice.id.value,
      name: invoice.name,
      document: invoice.document,
      number: invoice.address.number,
      street: invoice.address.street,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => {
        return {
          id: item.id.value,
          name: item.name,
          price: item.price,
        };
      }),
      total: invoice.total,
    };
  }
}
