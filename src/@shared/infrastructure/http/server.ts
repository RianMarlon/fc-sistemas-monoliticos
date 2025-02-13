import { Sequelize } from "sequelize-typescript";
import { join } from "path";

import fastifyServer from "./fastify";

const start = async () => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: join(__dirname, "../../../../sqlite.db"),
    models: [join(__dirname, "../../../**/*.model.{ts,js}")],
  });
  try {
    await sequelize.authenticate();
    await fastifyServer.listen({ port: Number(process.env.PORT || 3000) });
  } catch (err) {
    await sequelize.close();
    console.error(err);
    process.exit(1);
  }
};
start();
