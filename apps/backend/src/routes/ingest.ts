import express from "express";
import { prisma } from "../prisma";

const router = express.Router();

interface ScrapedItem {
    id: number,
    name: string,
    meal: string,
    hallid: number,
    date: Date,
    station: string,
}

router.post("/menuitems", async (req, res) => {
    try {
        const menuitems = req.body;
        
        await prisma.$transaction(
            menuitems.map((mi: ScrapedItem) => 
                prisma.menuItem.upsert({
                    where: {
                        id_name_meal_hallid_date: {
                            id: mi.id,
                            name: mi.name,
                            meal: mi.meal,
                            hallid: mi.hallid,
                            date: mi.date,
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
                        date: mi.date,
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

export default router;