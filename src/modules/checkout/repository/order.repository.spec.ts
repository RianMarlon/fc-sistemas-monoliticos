import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import OrderProductModel from "./order-product.model";
import OrderModel from "./order.model";
import ProductModel from "./product.model";
import Order from "../domain/order.entity";
import OrderRepository from "./order.repository";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";

describe("OrderRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    jest.useFakeTimers();
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      ClientModel,
      OrderModel,
      ProductModel,
      OrderProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe("addOrder", () => {
    it("should add an order", async () => {
      const client = await ClientModel.create({
        id: "1",
        name: "Client 1",
        email: "test@test.com",
        document: "12345678900",
        street: "Street 1",
        number: "123",
        complement: "Apt 1",
        city: "City 1",
        state: "State 1",
        zipCode: "12345-678",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const product1 = await ProductModel.create({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const product2 = await ProductModel.create({
        id: "2",
        name: "Product 2",
        description: "Product 2 description",
        salesPrice: 200,
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const order = new Order({
        client: new Client({
          id: client.id,
          name: client.name,
          address: client.street,
          email: client.email,
          createdAt: client.createdAt,
          updatedAt: client.updatedAt,
        }),
        products: [
          new Product({
            id: product1.id,
            name: product1.name,
            description: product1.description,
            salesPrice: product1.salesPrice,
            createdAt: product1.createdAt,
            updatedAt: product1.updatedAt,
          }),
          new Product({
            id: product2.id,
            name: product2.name,
            description: product2.description,
            salesPrice: product2.salesPrice,
            createdAt: product2.createdAt,
            updatedAt: product2.updatedAt,
          }),
        ],
      });

      const orderRepository = new OrderRepository();
      await orderRepository.addOrder(order);

      const orderCreated = await OrderModel.findOne({
        where: {
          id: order.id.value,
        },
        include: [OrderProductModel, ProductModel, ClientModel],
      });

      expect(order.id.value).toEqual(orderCreated.id);
      expect(order.status).toEqual(orderCreated.status);
      expect(order.total).toEqual(300);

      expect(order.client.id.value).toEqual(orderCreated.client.id);
      expect(order.client.name).toEqual(orderCreated.client.name);
      expect(order.client.address).toEqual(orderCreated.client.street);

      expect(order.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining(
            new Product({
              id: orderCreated.products[0].id,
              name: orderCreated.products[0].name,
              description: orderCreated.products[0].description,
              salesPrice: orderCreated.products[0].salesPrice,
            })
          ),
        ])
      );
      expect(order.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining(
            new Product({
              id: orderCreated.products[1].id,
              name: orderCreated.products[1].name,
              description: orderCreated.products[1].description,
              salesPrice: orderCreated.products[1].salesPrice,
            })
          ),
        ])
      );
    });
  });

  describe("findOrder", () => {
    it("should find a order", async () => {
      const clientCreated = await ClientModel.create({
        id: "1",
        name: "Client 1",
        email: "test@test.com",
        document: "12345678900",
        street: "Street 1",
        number: "123",
        complement: "Apt 1",
        city: "City 1",
        state: "State 1",
        zipCode: "12345-678",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const productCreated1 = await ProductModel.create({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const productCreated2 = await ProductModel.create({
        id: "2",
        name: "Product 2",
        description: "Product 2 description",
        salesPrice: 200,
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const orderCreated = await OrderModel.create(
        {
          id: "1",
          status: "pending",
          clientId: "1",
          orderProducts: [
            {
              id: "1",
              productId: productCreated1.id,
            },
            {
              id: "2",
              productId: productCreated2.id,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          include: [
            ClientModel,
            {
              model: OrderProductModel,
              include: [{ model: ProductModel }],
            },
          ],
        }
      );

      const orderRepository = new OrderRepository();
      const order = await orderRepository.findOrder("1");

      expect(order.id.value).toEqual(orderCreated.id);
      expect(order.status).toEqual(orderCreated.status);

      expect(order.client.id.value).toEqual(clientCreated.id);
      expect(order.client.name).toEqual(clientCreated.name);
      expect(order.client.email).toEqual(clientCreated.email);
      expect(order.client.address).toEqual(clientCreated.street);

      expect(order.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining(
            new Product({
              id: productCreated1.id,
              name: productCreated1.name,
              description: productCreated1.description,
              salesPrice: productCreated1.salesPrice,
            })
          ),
        ])
      );
      expect(order.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining(
            new Product({
              id: productCreated2.id,
              name: productCreated2.name,
              description: productCreated2.description,
              salesPrice: productCreated2.salesPrice,
            })
          ),
        ])
      );
    });

    it("should throw an error if the order not found", async () => {
      const orderRepository = new OrderRepository();
      await expect(orderRepository.findOrder("1")).rejects.toThrow(
        "Order not found"
      );
    });
  });
});
