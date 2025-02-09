import fastify from "fastify";
import invoiceRoutes from "../../../modules/invoice/infrastructure/http/fastify/routes/invoice.routes";
import clientsRoutes from "../../../modules/client-adm/infrastructure/http/fastify/clients.routes";
import productsRoutes from "../../../modules/product-adm/infrastructure/http/fastify/products.routes";

const fastifyServer = fastify({
  logger: true,
});

fastifyServer.register(invoiceRoutes, {
  prefix: "/invoices",
});

fastifyServer.register(clientsRoutes, {
  prefix: "/clients",
});

fastifyServer.register(productsRoutes, {
  prefix: "/products",
});

export default fastifyServer;
