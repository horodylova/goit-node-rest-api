import HttpError from '../helpers/HttpError.js';
import Contact from "../models/СontactModel.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const contactsController = {
  async getAllContacts(req, res, next) {
    try {
      const contacts = await Contact.find({ ownerId: req.user.id });
      res.send(contacts);
    } catch (err) {
      next(err);
    }
  },

  async getOneContact(req, res, next) {
    try {
      const contact = await Contact.findOne({ _id: req.params.id, ownerId: req.user.id });
      if (!contact) {
        throw new HttpError(404, "Contact not found");
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
        throw new HttpError(400, error.message);
      }

      const updatedContact = await Contact.findOneAndUpdate(
        { _id: id, ownerId: req.user.id },
        req.body,
        { new: true }
      );

      if (!updatedContact) {
        throw new HttpError(404, "Contact not found");
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
        throw new HttpError(404, "Contact not found");
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
        throw new HttpError(400, error.message);
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
        throw new HttpError(404, "Contact not found");
      }

      res.status(200).json(existingContact);
    } catch (error) {
      next(error);
    }
  }
};
