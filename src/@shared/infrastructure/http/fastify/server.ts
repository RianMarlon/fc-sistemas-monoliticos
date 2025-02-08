import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

const start = async () => {
  try {
    await fastify.listen({ port: Number(process.env.PORT || 3000) });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
