import Context from "../models/Context.js";

// Get all contexts for a user
export const getContexts = async (req, res) => {
  try {
    const contexts = await Context.find({ userId: req.params.userId });
    res.json(contexts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new context
export const createContext = async (req, res) => {
  try {
    const { userId, name, color, icon } = req.body;

    // Check if context with same name exists
    const existing = await Context.findOne({
      userId,
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: `Context "${name}" already exists!` });
    }

    const context = await Context.create({ userId, name, color, icon });
    res.status(201).json(context);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a context
export const deleteContext = async (req, res) => {
  try {
    const context = await Context.findByIdAndDelete(req.params.id);
    if (!context) {
      return res.status(404).json({ message: "Context not found" });
    }
    res.json({ message: "Context deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
