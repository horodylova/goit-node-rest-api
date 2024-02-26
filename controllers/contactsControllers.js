import Contact from "../models/ContactModel.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import HttpError from '../helpers/HttpError.js'


export const contactsController = {
  async getAllContacts(req, res, next) {
    try {
      const contacts = await Contact.find();
      res.send(contacts);
    } catch (err) {
      next(err);
    }
  },

  async getOneContact(req, res, next) {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        throw HttpError(404);
      } else {
        res.send(contact);
      }
    } catch (err) {
      next(err);
    }
  },

  async updateContact(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = updateContactSchema.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      }

      const { name, email, phone, favorite } = req.body;
      const updatedContact = await Contact.findByIdAndUpdate(
        id,
        { name, email, phone, favorite },
        { new: true }
      );

      if (!updatedContact) {
        throw HttpError(404, "Contact not found");
      }

      res.status(200).json({
        message: "Success",
        contact: updatedContact,
      });
    } catch (err) {
      next(err);
    }
  }, 

  async deleteContact(req, res, next) {
    const { id } = req.params;
    try {
      const deletedContact = await Contact.findByIdAndDelete(id);
      if (!deletedContact) {
        throw HttpError(404, "Contact not found");
      }
      res.status(200).json(deletedContact);
    } catch (error) {
      next(error);
    }
  }, 

  async createContact(req, res, next) {
    try {
      const { error } = createContactSchema.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      }

      const { name, email, phone, favorite } = req.body;
      const newContact = await Contact.create({ name, email, phone, favorite });
      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  },
  async updateStatusContact(req, res, next) {
    try {
      const { contactId } = req.params;
      const { favorite } = req.body;

      const existingContact = await Contact.findById(contactId);
      if (!existingContact) {
        throw HttpError(404, "Not found");
      }

      existingContact.favorite = favorite;
      const updatedContact = await existingContact.save();

      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  }
};
