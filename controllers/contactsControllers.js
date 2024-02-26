import Contact from "../models/ContactModel.js";

export const contactsController = {
  async getAllContacts(req, res, next) {
    try {
      const contacts = await Contact.find();
      res.send(contacts);
    } catch (err) {
      next(err);
    }
  },

  async getOneContact (req, res, next) {
    try {
      const contact = await Contact.findById();
      res.send(contact);

      if(contact === null) {
        res.status(404).send("Contact not found")
      }
    }
    catch (err) {next(err);
  }
}


};

// import catchAsync from '../utils/catchAsync.js';  

// const contactsController = {};

// contactsController.getAllContacts = catchAsync(async (req, res, next) => {
//   const contacts = await Contact.find();
//   res.status(200).json({
//     message: 'Success',
//     contacts,
//   });
// });

// contactsController.getOneContact = catchAsync(async (req, res, next) => {
//   const contact = await Contact.findById(req.params.id);
//   if (!contact) {
//     return next(new HttpError(404, 'Not Found'));
//   }
//   res.status(200).json({
//     message: 'Success',
//     contact,
//   });
// });

// contactsController.updateContact = catchAsync(async (req, res, next) => {
//     const { id } = req.params;

//     const renewContact = await Contact.findByIdAndUpdate(id, {name, email, phone, favorite}, {new: true});
//     res.status(200).json({
//     message: 'Success',
//     contact: renewContact,
//   })
// });


// contactsController.deleteContact = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const deletedContact = await contactsService.deleteContact(id);
//     if (!deletedContact) {
//       throw HttpError(404, "Contact not found");
//     }
//     res.status(200).json(deletedContact);
//   } catch (error) {
//     next(error);
//   }
// };

// contactsController.createContact = async (req, res, next) => {
//   try {
//     const { error } = createContactSchema.validate(req.body);
//     if (error) {
//       throw HttpError(400, error.message);
//     }
//     const newContact = await contactsService.createContact(req.body);
//     res.status(201).json(newContact);
//   } catch (error) {
//     next(error);
//   }
// };

//

// export default contactsController;


// contactsController.getAllContacts = async (req, res, next) => {
//   try {
//     const contacts = await contactsService.getAllContacts();
//     res.status(200).json(contacts);
//   } catch (error) {
//     next(error);
//   }
// };

// contactsController.getOneContact = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const contact = await contactsService.getOneContact(id);
//     if (!contact) {
//       throw HttpError(404, "Contact not found");
//     }
//     res.status(200).json(contact);
//   } catch (error) {
//     next(error);
//   }
// };

// contactsController.deleteContact = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const deletedContact = await contactsService.deleteContact(id);
//     if (!deletedContact) {
//       throw HttpError(404, "Contact not found");
//     }
//     res.status(200).json(deletedContact);
//   } catch (error) {
//     next(error);
//   }
// };

// contactsController.createContact = async (req, res, next) => {
//   try {
//     const { error } = createContactSchema.validate(req.body);
//     if (error) {
//       throw HttpError(400, error.message);
//     }
//     const newContact = await contactsService.createContact(req.body);
//     res.status(201).json(newContact);
//   } catch (error) {
//     next(error);
//   }
// };

// contactsController.updateContact = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const { error } = updateContactSchema.validate(req.body);
//     if (error) {
//       throw HttpError(400, error.message);
//     }
//     const updatedContact = await contactsService.updateContact(id, req.body);
//     if (!updatedContact) {
//       throw HttpError(404, "Contact not found");
//     }
//     res.status(200).json(updatedContact);
//   } catch (error) {
//     next(error);
//   }
// };

// export default contactsController;
