import { Document, Schema, Model, model } from 'mongoose';

interface RaffleAttrs {
  userId: string;
  prize: number;
  description?: string;
  quantityNumbers?: number;
  quantitySeries?: number;
  ticketPrice: number;
}

export interface RaffleDoc extends Document {
  userId: string;
  prize: number;
  description?: string;
  quantityNumbers: number;
  quantitySeries?: number;
  ticketPrice: number;
  complete: boolean;
}

interface RaffleModel extends Model<RaffleDoc> {
  build(attrs: RaffleAttrs): RaffleDoc;
}

const raffleSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    prize: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
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

raffleSchema.set('versionKey', 'version');

raffleSchema.statics.build = (attrs: RaffleAttrs) => {
  return new Raffle(attrs);
};

const Raffle = model<RaffleDoc, RaffleModel>('Raffle', raffleSchema);

export { Raffle };
