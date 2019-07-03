
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class InvoiceItemProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "InvoiceItem";

    this.private = true;
  }


  async create(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    const {
      id: currentUserId,
    } = await this.getUser(true);


    Object.assign(args.data, {
      CreatedBy: {
        connect: {
          id: currentUserId,
        },
      },
    });


    return super.create(method, args, info);
  }


  async update(method, args, info) {

    if (args.data) {

      let {
        CreatedBy,
        ...data
      } = args.data;

      args.data = data;

    }

    return super.update(method, args, info);
  }


  async mutate(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    await this.checkPermission(method, args, info);

    // console.log("InvoiceItem mutate args", args);

    // this.addError("InvoiceItem Debug");
    // return false;

    return super.mutate(method, args);
  }



  async delete(method, args, info) {

    return super.delete(method, args);
  }
}


export default class InvoiceItemModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return InvoiceItemProcessor;
  }


  getResolvers() {

    const {
      Query: {
        ...Query
      },
      Subscription: {
        ...Subscription
      },
      Mutation: {
        ...Mutation
      },
      ...other
    } = super.getResolvers();

    return {
      ...other,
      Query: {
        ...Query,
        invoiceItem: (source, args, ctx, info) => {
          return ctx.db.query.invoiceItem(args, info);
        },
        invoiceItems: (source, args, ctx, info) => {
          return ctx.db.query.invoiceItems(args, info);
        },
        invoiceItemsConnection: (source, args, ctx, info) => {
          return ctx.db.query.invoiceItemsConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        createInvoiceItemProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).createWithResponse("InvoiceItem", args, info);
        },
        updateInvoiceItemProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).updateWithResponse("InvoiceItem", args, info);
        },
        deleteInvoiceItem: (source, args, ctx, info) => {
          return this.getProcessor(ctx).delete("InvoiceItem", args, info);
        },
      },
      Subscription: {
        ...Subscription,
        invoiceItem: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.invoiceItem({}, info);
          },
        },
      },
      InvoiceItemResponse: {
        data: (source, args, ctx, info) => {

          const {
            id,
          } = source.data || {};

          return id ? ctx.db.query.invoiceItem({
            where: {
              id,
            },
          }, info) : null;
        },
      },
    }

  }

}