import express from "express";
import { prisma } from "../prisma.js";

const router = express.Router();

router.get("/dininghall", async (req, res) => {
    try {
        const dininghalls = await prisma.diningHall.findMany({
            orderBy: { name: "asc" },
        });

        res.json(dininghalls);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch dininghalls" });
    }
});

router.get("/dininghall/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({ error: "Invalid dining hall id" });
        }

        const dininghall = await prisma.diningHall.findUnique({
            where: { id },
        });

        if (!dininghall) {
            return res.status(404).json({ error: "Dining hall not found" });
        }

        res.json(dininghall);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch dining hall" });
    }
});

export default router;
