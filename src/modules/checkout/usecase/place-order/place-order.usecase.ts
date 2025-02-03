import UseCaseInterface from "../../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import { InvoiceFacadeInterface } from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  constructor(
    private _clientFacade: ClientAdmFacadeInterface,
    private _productFacade: ProductAdmFacadeInterface,
    private _catalogFacade: StoreCatalogFacadeInterface,
    private _repository: CheckoutGateway,
    private _invoiceFacade: InvoiceFacadeInterface,
    private _paymentFacade: PaymentFacadeInterface
  ) {}

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({
      id: input.clientId,
    });
    if (!client) {
      throw new Error("Client not found");
    }

    await this.validateProducts(input);

    const products = await Promise.all(
      input.products.map((product) => this.getProduct(product.productId))
    );

    const myClient = new Client({
      id: client.id,
      name: client.name,
      address: client.street,
      email: client.email,
    });

    const order = new Order({
      client: myClient,
      products,
    });

    const payment = await this._paymentFacade.process({
      orderId: order.id.value,
      amount: order.total,
    });

    const invoice =
      payment.status === "approved"
        ? await this._invoiceFacade.generateInvoice({
            name: client.name,
            document: client.document,
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            items: products.map((product) => {
              return {
                id: product.id.value,
                name: product.name,
                price: product.salesPrice,
              };
            }),
          })
        : null;

    payment.status === "approved" && order.approved();
    this._repository.addOrder(order);

    return {
      id: order.id.value,
      invoiceId: invoice ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map((product) => {
        return {
          productId: product.id.value,
        };
      }),
    };
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (!input.products.length) {
      throw new Error("No products selected");
    }

    for (const product of input.products) {
      const productExists = await this._productFacade.checkStock({
        productId: product.productId,
      });
      if (productExists.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        );
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({ id: productId });
    if (!product) {
      throw new Error("Product not found");
    }

    return new Product({
      id: product.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}
