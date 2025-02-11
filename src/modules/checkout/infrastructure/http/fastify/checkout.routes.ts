import { FastifyInstance } from "fastify";
import { InvoiceFacadeFactory } from "../../../../invoice/factory/invoice.facade.factory";
import ClientAdmFacadeFactory from "../../../../client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../../store-catalog/factory/facade.factory";
import OrderRepository from "../../../repository/order.repository";
import PaymentFacadeFactory from "../../../../payment/factory/payment.facade.factory";
import PlaceOrderUseCase from "../../../usecase/place-order/place-order.usecase";

export default function (fastify: FastifyInstance) {
  fastify.post("/", async function (request, reply) {
    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const repository = new OrderRepository();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();

    const placeOrderUseCase = new PlaceOrderUseCase(
      clientFacade,
      productFacade,
      catalogFacade,
      repository,
      invoiceFacade,
      paymentFacade
    );

    const requestBody = request.body as any;

    try {
      const orderCreated = await placeOrderUseCase.execute({
        clientId: requestBody.clientId,
        products: requestBody.products,
      });

      return reply.code(201).send(orderCreated);
    } catch (error) {
      return reply.code(500).send(error);
    }
  });
}
