import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import { InvoiceGateway } from "../gateway/invoice.gateway";
import InvoiceAddressModel from "./invoice-address.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export class InvoiceRepository implements InvoiceGateway {
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: {
        id,
      },
      include: [InvoiceItemModel, InvoiceAddressModel],
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return new Invoice({
      id: invoice.id,
      name: invoice.name,
      document: invoice.document,
      address: new Address({
        number: invoice.address.number,
        street: invoice.address.street,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      }),
      items: invoice.items.map(
        (item) =>
          new InvoiceItem({
            id: item.id,
            name: item.name,
            price: item.price,
          })
      ),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }

  async generate(invoice: Invoice): Promise<void> {
    const addressId = new Id();
    await InvoiceModel.create(
      {
        id: invoice.id.value,
        name: invoice.name,
        document: invoice.document,
        address: {
          id: addressId.value,
          number: invoice.address.number,
          street: invoice.address.street,
          complement: invoice.address.complement,
          city: invoice.address.city,
          state: invoice.address.state,
          zipCode: invoice.address.zipCode,
          createdAt: invoice.address.createdAt,
        },
        items: invoice.items.map((item) => {
          return {
            id: item.id.value,
            name: item.name,
            price: item.price,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        }),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      {
        include: [InvoiceItemModel, InvoiceAddressModel],
      }
    );
  }
}
