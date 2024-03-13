import mongoose from "mongoose";
import gravatar from 'gravatar'; 
import Jimp from 'jimp';


const UserSchema = mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  avatarURL: {  
    type: String,
    default: null,
  },
});

UserSchema.pre('save', async function(next) {
  if (!this.avatar) {
    const avatarURL = gravatar.url(this.email, { s: '200', d: 'identicon' });
    const image = await Jimp.read(avatarURL);

    image.resize(250, 250);

    const base64Image = await image.getBase64Async(Jimp.AUTO);

    this.avatarURL = base64Image;
  }
  next();
});

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
