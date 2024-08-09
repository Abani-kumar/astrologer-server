import express from "express";
import {
  addAstrologer,
  getAllAstrologers,
  getAstrologerDetails,
  searchAstrologers,
  updateAstrologer,
  deleteAstrologer,
} from "../controllers/astrologer.controller.js";

const router = express.Router();

router.get("/astrologers", getAllAstrologers);
router.get("/astrologers/:id", getAstrologerDetails);
router.get("/astrologers/search/:search", searchAstrologers);
router.post("/astrologers", addAstrologer);
router.patch("/astrologers/:id", updateAstrologer);
router.delete("/astrologers/:id", deleteAstrologer);

export default router;
