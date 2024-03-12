import express from "express";
import { contactsController } from "../controllers/contactsControllers.js"; 

const contactsRouter = express.Router();
const jsonParser = express.json();

contactsRouter.get("/", contactsController.getAllContacts);  
contactsRouter.get("/:id", contactsController.getOneContact);
contactsRouter.delete("/:id", contactsController.deleteContact);
contactsRouter.post("/", jsonParser, contactsController.createContact);
contactsRouter.put("/:id", jsonParser, contactsController.updateContact);
contactsRouter.patch("/:contactId/favorite", contactsController.updateStatusContact);


export default contactsRouter;
