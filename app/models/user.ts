import mongoose, { Document, Schema } from "mongoose";

interface UserInterface extends Document {
  name: string;
  email: string;
}

const UserSchema: Schema<UserInterface> = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});

const User =
  mongoose.models.User || mongoose.model<UserInterface>("User", UserSchema);
export default User;
