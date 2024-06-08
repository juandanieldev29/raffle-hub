import { Document, Schema, Model, model } from 'mongoose';

import { RaffleDoc } from './raffle';

interface TicketAttrs {
  userId: string;
  number: number;
  serie: number;
  raffle: RaffleDoc;
  orderId: string;
}

interface TicketDoc extends Document {
  userId: string;
  number: number;
  serie: number;
  raffle: RaffleDoc;
  orderId: string;
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    serie: {
      type: Number,
    },
    raffle: {
      type: Schema.Types.ObjectId,
      ref: 'Raffle',
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

ticketSchema.set('versionKey', 'version');

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
