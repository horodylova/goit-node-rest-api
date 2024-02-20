import { Schema, model } from 'mongoose'; 
// import { contactRolesEnum } from '../constants/contactRolesEnum.js';  

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = model('Contact', contactSchema); 
export default Contact;