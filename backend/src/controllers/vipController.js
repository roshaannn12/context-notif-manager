import VipContact from "../models/VipContact.js";

// Get all VIP contacts for a user
export const getVipContacts = async (req, res) => {
  try {
    const contacts = await VipContact.find({ userId: req.params.userId });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a VIP contact
export const addVipContact = async (req, res) => {
  try {
    const { userId, app, contactName } = req.body;

    // Check if already exists
    const existing = await VipContact.findOne({
      userId,
      app,
      contactName: { $regex: new RegExp(`^${contactName}$`, "i") },
    });

    if (existing) {
      return res.status(400).json({
        message: `${contactName} is already a VIP contact for ${app}!`,
      });
    }

    const contact = await VipContact.create({ userId, app, contactName });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a VIP contact
export const deleteVipContact = async (req, res) => {
  try {
    const contact = await VipContact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "VIP contact not found" });
    }
    res.json({ message: "VIP contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
