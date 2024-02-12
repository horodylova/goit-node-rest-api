import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; 
import { readFile, writeFile } from "fs/promises";
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contactsPath = join(__dirname, "db", "contacts.json"); 

const listContacts = async () => {
  const data = await readFile(contactsPath, "utf8");
  return JSON.parse(data);
};

const getContactById = async (id) => {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === id);
  return result || null;
};

const addContact = async (data) => {
  const contacts = await listContacts();
  const newContact = { id: uuidv4(), ...data };
  contacts.push(newContact);
  await writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
  return newContact;
};

const removeContact = async (id) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);

  await writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
  return result;
};

export default {
  getAllContacts: listContacts,
  getOneContact: getContactById,
  deleteContact: removeContact,
  createContact: addContact,
  updateContact,
};

