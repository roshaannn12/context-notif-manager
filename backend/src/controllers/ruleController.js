import Rule from "../models/Rule.js";

// Create a new rule
export const createRule = async (req, res) => {
  try {
    const { userId, appName, context, action } = req.body;
    const rule = await Rule.create({ userId, appName, context, action });
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rules for a user
export const getUserRules = async (req, res) => {
  try {
    const rules = await Rule.find({ userId: req.params.userId });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a rule
export const updateRule = async (req, res) => {
  try {
    const rule = await Rule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }
    res.json(rule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a rule
export const deleteRule = async (req, res) => {
  try {
    const rule = await Rule.findByIdAndDelete(req.params.id);
    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }
    res.json({ message: "Rule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
