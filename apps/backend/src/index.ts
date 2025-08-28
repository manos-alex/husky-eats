import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(helmet());
app.use(cors({ origin:"*" })); // CHANGE THIS LATER ON
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`API on http://localhost:${port}`));