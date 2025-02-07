import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import ClientModel from "./client.model";
import OrderProductModel from "./order-product.model";
import OrderModel from "./order.model";
import ProductModel from "./product.model";

export default class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id.value,
        status: order.status,
        clientId: order.client.id.value,
        orderProducts: order.products.map((product) => {
          const orderProductId = new Id();
          return {
            id: orderProductId.value,
            productId: product.id.value,
          };
        }),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      {
        include: [ClientModel, OrderProductModel],
      }
    );
  }

  async findOrder(id: string): Promise<Order> {
    const order = await OrderModel.findOne({
      where: {
        id,
      },
      include: [OrderProductModel, ProductModel, ClientModel],
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return new Order({
      id: order.id,
      status: order.status,
      client: new Client({
        id: order.client.id,
        name: order.client.name,
        email: order.client.email,
        address: order.client.street,
        createdAt: order.client.createdAt,
        updatedAt: order.client.updatedAt,
      }),
      products: order.products.map((product) => {
        return new Product({
          id: product.id,
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        });
      }),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  }
}
