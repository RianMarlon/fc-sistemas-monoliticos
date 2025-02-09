import fastifyServer from "./fastify";

const start = async () => {
  try {
    await fastifyServer.listen({ port: Number(process.env.PORT || 3000) });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
