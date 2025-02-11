import fastify from "fastify";
import invoiceRoutes from "../../../modules/invoice/infrastructure/http/fastify/routes/invoice.routes";
import clientsRoutes from "../../../modules/client-adm/infrastructure/http/fastify/clients.routes";
import productsRoutes from "../../../modules/product-adm/infrastructure/http/fastify/products.routes";
import checkoutRoutes from "../../../modules/checkout/infrastructure/http/fastify/checkout.routes";

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

fastifyServer.register(checkoutRoutes, {
  prefix: "/checkout",
});

export default fastifyServer;
