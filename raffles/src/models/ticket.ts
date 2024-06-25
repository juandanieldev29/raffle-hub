import { Document, Schema, Model, model } from 'mongoose';

import { RaffleDoc } from './raffle';
import { UserProfile } from '../types/user-profile';

interface TicketAttrs {
  buyer: UserProfile;
  number: number;
  serie?: number;
  raffle: RaffleDoc;
}

export interface TicketDoc extends Document {
  buyer: UserProfile;
  number: number;
  serie?: number;
  raffle: RaffleDoc;
  createdAt: Date;
  updatedAt: Date;
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new Schema(
  {
    buyer: {
      id: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      photoURL: {
        type: String,
      },
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
  },
  {
    timestamps: true,
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
