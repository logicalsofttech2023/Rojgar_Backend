import express from "express";

import {
  createSuggestion,
  getSuggestions,
  updateSuggestion,
  deleteSuggestion,
} from "../controllers/suggetion_controller.js";

const router = express.Router();

router.post("/create_sug", createSuggestion);
router.post("/read_sug", getSuggestions);
router.put("/update_sug", updateSuggestion);
router.delete("/delete_sug", deleteSuggestion);

export default router;
