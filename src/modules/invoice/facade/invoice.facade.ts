import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import {
  FindInvoiceFacadeInput,
  FindInvoiceFacadeOutput,
  GenerateInvoiceFacadeInput,
  GenerateInvoiceFacadeOutput,
  InvoiceFacadeInterface,
} from "./invoice.facade.interface";

export class InvoiceFacade implements InvoiceFacadeInterface {
  constructor(
    private _findInvoiceUseCase: UseCaseInterface,
    private _generateInvoiceUseCase: UseCaseInterface
  ) {}

  async findInvoice(
    input: FindInvoiceFacadeInput
  ): Promise<FindInvoiceFacadeOutput> {
    return await this._findInvoiceUseCase.execute(input);
  }

  async generateInvoice(
    input: GenerateInvoiceFacadeInput
  ): Promise<GenerateInvoiceFacadeOutput> {
    return await this._generateInvoiceUseCase.execute(input);
  }
}
