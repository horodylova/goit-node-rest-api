import HttpError from '../helpers/HttpError.js';
import Contact from "../models/ContactModel.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const contactsController = {
  async getAllContacts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const contacts = await Contact.find({ ownerId: req.user.id }).skip(skip).limit(limit);
      res.send(contacts);
    } catch (err) {
      next(err);
    }
  },

  async getOneContact(req, res, next) {
    try {
      const contact = await Contact.findOne({ _id: req.params.id, ownerId: req.user.id });
      if (!contact) {
        throw HttpError(404, "Contact not found");
      }
      res.send(contact);
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

      const updatedContact = await Contact.findOneAndUpdate(
        { _id: id, ownerId: req.user.id },
        req.body,
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
      const deletedContact = await Contact.findOneAndDelete({ _id: id, ownerId: req.user.id });
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

      const newContact = await Contact.create({ ...req.body, ownerId: req.user.id });
      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  },

  async updateStatusContact(req, res, next) {
    try {
      const { contactId } = req.params;
      const { favorite } = req.body;

      const existingContact = await Contact.findOneAndUpdate(
        { _id: contactId, ownerId: req.user.id },
        { favorite },
        { new: true }
      );

      if (!existingContact) {
        throw HttpError(404, "Contact not found");
      }

      res.status(200).json(existingContact);
    } catch (error) {
      next(error);
    }
  }
};