import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; 
import { readFile, writeFile } from "fs/promises";
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contactsPath = join(__dirname, "../contacts.json");

export const listContacts = async () => {
  const data = await readFile(contactsPath, "utf8");
  return JSON.parse(data);
};

export const getAllContacts = async () => {
  const data = await listContacts();
  return data;
};

export const getOneContact = async (id) => {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === id);
  return result || null;
};

export const createContact = async (data) => {
  const contacts = await listContacts();
  const newContact = { id: uuidv4(), ...data };
  contacts.push(newContact);
  await writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
  return newContact;
};

export const deleteContact = async (id) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);

  await writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
  return result;
};

export const updateContact = async (id, newData) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;  
  }
  
  contacts[index] = { ...contacts[index], ...newData };
  await writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
  return contacts[index];
};

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
};