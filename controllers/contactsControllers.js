import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.getAllContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error getting all contacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await contactsService.getOneContact(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error("Error getting contact by id:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await contactsService.deleteContact(id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(deletedContact);
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createContact = async (req, res) => {
  const { body } = req;
  try {
    const newContact = await contactsService.createContact(body);
    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const updatedContact = await contactsService.updateContact(id, body);
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};
