
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class InvoiceProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "Invoice";

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

    // console.log("Invoice mutate args", args);

    // this.addError("Invoice Debug");
    // return false;

    return super.mutate(method, args);
  }



  async delete(method, args, info) {

    return super.delete(method, args);
  }
}


export default class InvoiceModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return InvoiceProcessor;
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
        invoice: (source, args, ctx, info) => {
          return ctx.db.query.invoice(args, info);
        },
        invoices: (source, args, ctx, info) => {
          return ctx.db.query.invoices(args, info);
        },
        invoicesConnection: (source, args, ctx, info) => {
          return ctx.db.query.invoicesConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        createInvoiceProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).createWithResponse("Invoice", args, info);
        },
        updateInvoiceProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).updateWithResponse("Invoice", args, info);
        },
        deleteInvoice: (source, args, ctx, info) => {
          return this.getProcessor(ctx).delete("Invoice", args, info);
        },
      },
      Subscription: {
        ...Subscription,
        invoice: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.invoice({}, info);
          },
        },
      },
      InvoiceResponse: {
        data: (source, args, ctx, info) => {

          const {
            id,
          } = source.data || {};

          return id ? ctx.db.query.invoice({
            where: {
              id,
            },
          }, info) : null;
        },
      },
    }

  }

}