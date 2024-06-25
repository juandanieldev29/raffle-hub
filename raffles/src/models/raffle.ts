import { Document, Schema, Model, model } from 'mongoose';

import { TicketDoc } from './ticket';
import { UserProfile } from '../types/user-profile';

interface RaffleAttrs {
  owner: UserProfile;
  prize: number;
  description: string;
  quantityNumbers?: number;
  quantitySeries?: number;
  ticketPrice: number;
}

export interface RaffleDoc extends Document {
  owner: UserProfile;
  prize: number;
  description: string;
  quantityNumbers: number;
  quantitySeries?: number;
  ticketPrice: number;
  complete: boolean;
  createdAt: Date;
  updatedAt: Date;
  tickets: TicketDoc[];
  boughtTickets: number;
  lastAvailableNumber: number;
}

interface RaffleModel extends Model<RaffleDoc> {
  build(attrs: RaffleAttrs): RaffleDoc;
}

const raffleSchema = new Schema(
  {
    owner: {
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
    prize: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantityNumbers: {
      type: Number,
      default: 100,
    },
    quantitySeries: {
      type: Number,
    },
    ticketPrice: {
      type: Number,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    tickets: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

raffleSchema.set('versionKey', 'version');

raffleSchema.virtual('boughtTickets').get(function () {
  return this.tickets.length;
});

raffleSchema.virtual('lastAvailableNumber').get(function () {
  return this.quantityNumbers - 1;
});

raffleSchema.statics.build = (attrs: RaffleAttrs) => {
  return new Raffle(attrs);
};

const Raffle = model<RaffleDoc, RaffleModel>('Raffle', raffleSchema);

export { Raffle };
