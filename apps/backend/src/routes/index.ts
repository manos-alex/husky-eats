import express from "express";
import dininghall from "./dininghall.js";
import menuitem from "./menuitem.js";
import nutrition from "./nutrition.js";

const router = express.Router();

router.get("/", (_req, res) => res.json({ ok: true }));

router.use("/", dininghall);
router.use("/", menuitem);
router.use("/", nutrition);

export default router;