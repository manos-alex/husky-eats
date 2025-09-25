import express from "express";
import { prisma } from "../prisma";

const router = express.Router();

router.get("/dininghall", async (req, res) => {
    try {
        const { id, name } = req.query;

        const dininghalls = await prisma.diningHall.findMany({
            where: {
                ...(id ? {id : Number(id)} : {}),
                ...(name ? {name : String(name)} : {}),
            },
            orderBy: { name: "asc" },
        });

        res.json(dininghalls);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch dininghalls" });
    }
});

export default router;