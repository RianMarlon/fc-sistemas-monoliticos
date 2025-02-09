import { FastifyInstance } from "fastify";
import ClientRepository from "../../../repository/client.repository";
import AddClientUseCase from "../../../usecase/add-client/add-client.usecase";

export default function (fastify: FastifyInstance) {
  fastify.post("/", async function (request, reply) {
    const clientRepository = new ClientRepository();
    const addClientUseCase = new AddClientUseCase(clientRepository);

    const requestBody = request.body as any;

    try {
      const clientCreated = await addClientUseCase.execute({
        name: requestBody.name,
        document: requestBody.document,
        email: requestBody.email,
        street: requestBody.street,
        number: requestBody.number,
        complement: requestBody.complement,
        city: requestBody.city,
        state: requestBody.state,
        zipCode: requestBody.zipCode,
      });

      return reply.code(201).send(clientCreated);
    } catch (error) {
      return reply.code(500).send(error);
    }
  });
}
