import express from "express";
import dininghall from "./dininghall";
import menuitem from "./menuitem";
import nutrition from "./nutrition";

const router = express.Router();

router.get("/", (_req, res) => res.json({ ok: true }));

router.use("/", dininghall);
router.use("/", menuitem);
router.use("/", nutrition);

export default router;