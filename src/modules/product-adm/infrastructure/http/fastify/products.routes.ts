import { FastifyInstance } from "fastify";
import ProductRepository from "../../../repository/product.repository";
import AddProductUseCase from "../../../usecase/add-product/add-product.usecase";

export default function (fastify: FastifyInstance) {
  fastify.post("/", async function (request, reply) {
    const productsRepository = new ProductRepository();
    const addProductUseCase = new AddProductUseCase(productsRepository);

    const requestBody = request.body as any;

    try {
      const productCreated = await addProductUseCase.execute({
        name: requestBody.name,
        description: requestBody.description,
        purchasePrice: requestBody.purchasePrice,
        stock: requestBody.stock,
      });

      return reply.code(201).send(productCreated);
    } catch (error) {
      return reply.code(500).send(error);
    }
  });
}
