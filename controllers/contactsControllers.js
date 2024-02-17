import HttpError from "../helpers/HttpError.js";
import contactsService from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const contactsController = {};

contactsController.getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.getAllContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

contactsController.getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await contactsService.getOneContact(id);
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

contactsController.deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedContact = await contactsService.deleteContact(id);
    if (!deletedContact) {
      throw HttpError(404, "Contact not found");
    }
    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

contactsController.createContact = async (req, res, next) => {
  const { body } = req;
  try {
    const { error } = createContactSchema.validate(body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const newContact = await contactsService.createContact(body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

contactsController.updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const { error } = updateContactSchema.validate(body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const updatedContact = await contactsService.updateContact(id, body);
    if (!updatedContact) {
      throw HttpError(404, "Contact not found");
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export default contactsController;
