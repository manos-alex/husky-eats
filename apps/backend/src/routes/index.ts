import express from "express";
import ingest from "./ingest";

const router = express.Router();

router.get("/", (_req, res) => res.json({ ok: true }));

router.get("/ingest", ingest);

export default router;