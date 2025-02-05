import { SequelizeStorage, Umzug } from "umzug";
import { join } from "path";
import { Sequelize } from "sequelize";

export const migrator = (sequelize: Sequelize) => {
  return new Umzug({
    migrations: {
      glob: [
        join(__dirname, "migrations/*.ts"),
        {
          cwd: __dirname,
        },
      ],
    },
    context: sequelize,
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });
};
