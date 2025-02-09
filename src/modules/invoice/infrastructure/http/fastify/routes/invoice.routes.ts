import { FastifyInstance } from "fastify";
import { InvoiceRepository } from "../../../../repository/invoice.repository";
import FindInvoiceUseCase from "../../../../usecase/find-invoice/find-invoice.usecase";

export default function (fastify: FastifyInstance) {
  fastify.get("/:invoiceId", async function (request, reply) {
    const { invoiceId } = request.params as any;
    const invoiceRepository = new InvoiceRepository();
    const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);

    try {
      const invoice = await findInvoiceUseCase.execute({ id: invoiceId });
      return reply.code(200).send(invoice);
    } catch (error) {
      return reply.code(500).send(error);
    }
  });
}
