import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const UserSchema = new Schema<IUser, UserModel>(
   {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
   },
   { timestamps: true },
);

UserSchema.statics.isUserExists = async function (
   email: string,
): Promise<Pick<IUser, 'email' | 'password'> | null> {
   const user = await User.findOne({ email }, { email: 1, password: 1 });
   return user;
};

UserSchema.statics.isPasswordMatch = async function (
   givenPassword: string,
   savedPassword: string,
): Promise<boolean> {
   const isMatch = await bcrypt.compare(givenPassword, savedPassword);
   return isMatch;
};

UserSchema.pre('save', async function (next) {
   const user = this;
   //password hashing
   user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
   next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
