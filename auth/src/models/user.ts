import { Document, Schema, Model, model } from 'mongoose';

interface UserAttrs {
  googleId: string;
  email: string;
  name: string;
  photoURL?: string;
}

export interface UserDoc extends Document {
  googleId: string;
  email: string;
  name: string;
  photoURL?: string;
}

interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new Schema(
  {
    googleId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
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

userSchema.set('versionKey', 'version');

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = model<UserDoc, UserModel>('User', userSchema);

export { User };
