import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  picture: string;
  role: string;
  accessToken?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: String,
  email: { type: String, unique: true },
  picture: String,
  role: { type: String, default: "user" },
  accessToken: String,
});

export default mongoose.model<IUser>("User", userSchema);