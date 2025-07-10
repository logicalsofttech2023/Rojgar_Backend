import Suggestion from "../models/Suggetion.js";

export const createSuggestion = async (req, res) => {
  try {
    const { Sug_Name, Suggestions, Sug_Type } = req.body;

    if (!Sug_Name || !Sug_Type || !Array.isArray(Suggestions)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const newSuggestion = await Suggestion.create({
      Sug_Name,
      Suggestions,
      Sug_Type,
    });

    res
      .status(201)
      .json({ message: "Suggestion created", data: newSuggestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **2. Read Suggestions by Sug_Type**
export const getSuggestions = async (req, res) => {
  try {
    const { Sug_Name } = req.body;
    const suggestion = await Suggestion.findOne({ where: { Sug_Name } });

    if (!suggestion) {
      return res
        .status(404)
        .json({ stat: true, error: "Suggestion type not found" });
    }
    return res
      .status(200)
      .json({
        stat: true,
        data: suggestion,
        sug_data: JSON.parse(suggestion.Suggestions),
      });
  } catch (error) {
    return res.status(500).json({ stat: true, error: error.message });
  }
};

// **3. Update Suggestions by Adding More Entries**
export const updateSuggestion = async (req, res) => {
  try {
    const { id } = req.query;
    const { Sug_Name, Suggestions, Sug_Type } = req.body;

    if (!Sug_Name || !Sug_Type || !Array.isArray(Suggestions)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const suggestion = await Suggestion.findByPk(id);
    if (!suggestion) {
      return res.status(404).json({ error: "Suggestion not found" });
    }

    suggestion.Sug_Name = Sug_Name;
    suggestion.Suggestions = Suggestions;
    suggestion.Sug_Type = Sug_Type;

    await suggestion.save();

    res.status(200).json({
      message: "Suggestion updated",
      data: suggestion,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// **4. Delete a Specific Suggestion**
export const deleteSuggestion = async (req, res) => {
  try {
    const { Sug_Type, suggestion_to_delete } = req.body;

    if (!Sug_Type || !suggestion_to_delete) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const suggestionRecord = await Suggestion.findOne({ where: { Sug_Type } });

    if (!suggestionRecord) {
      return res.status(404).json({ error: "Suggestion type not found" });
    }

    // Remove the specific suggestion
    let updatedSuggestions = suggestionRecord.Suggestions.filter(
      (item) => item !== suggestion_to_delete
    );

    // Update the record
    await Suggestion.update(
      { Suggestions: updatedSuggestions },
      { where: { Sug_Type } }
    );

    res.status(200).json({ message: "Suggestion deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
