import fastify from "fastify";
import invoiceRoutes from "../../../modules/invoice/infrastructure/http/fastify/routes/invoice.routes";

const fastifyServer = fastify({
  logger: true,
});

fastifyServer.register(invoiceRoutes, {
  prefix: "/invoices/",
});

export default fastifyServer;
