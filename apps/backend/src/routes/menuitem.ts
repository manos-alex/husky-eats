import express from "express";
import { prisma } from "../prisma.js";
import { requireApiKey } from "../middleware.js";
import { toLowerCase } from "zod";

const router = express.Router();

interface MenuItem {
    id: number,
    name: string,
    meal: string,
    hallid: number,
    date: Date,
    station: string,
}

router.post("/menuitem", requireApiKey, async (req, res) => {
    try {
        const menuitems = req.body;
        
        await prisma.$transaction(
            menuitems.map((mi: MenuItem) => 
                prisma.menuItem.upsert({
                    where: {
                        id_name_meal_hallid_date: {
                            id: mi.id,
                            name: mi.name,
                            meal: mi.meal,
                            hallid: mi.hallid,
                            date: new Date(mi.date),
                        },
                    },
                    update: {
                        station: mi.station,
                    },
                    create: {
                        id: mi.id,
                        name: mi.name,
                        meal: mi.meal,
                        hallid: mi.hallid,
                        date: new Date(mi.date),
                        station: mi.station,
                    },
                })
            )
        );

        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ingest failed" });
    }
});

router.get("/menuitem", async (req, res) => {
    try {
        const { hallid, date, meal } = req.query;

        const menuitems = await prisma.menuItem.findMany({
            where: {
                ...(hallid ? {hallid : Number(hallid)} : {}),
                ...(date ? {date : new Date(String(date))} : {}),
                ...(meal ? {meal : String(meal).toLowerCase()} : {}),
            },
            orderBy: { station: "desc" },
        });

        res.json(menuitems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch menuitems" });
    }
});

export default router;