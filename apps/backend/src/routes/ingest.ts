import express from "express";
import { prisma } from "../prisma";

const router = express.Router();

interface MenuItem {
    id: number,
    name: string,
    meal: string,
    hallid: number,
    date: Date,
    station: string,
}

interface NutritionFacts {
    name: string,
    vegan: boolean | null,
    vegetarian: boolean | null,
    glutenfriendly: boolean | null,
    smartcheck: boolean | null,
    lesssodium: boolean | null,
    nogarliconion: boolean | null,
    containsnuts: boolean | null,
    servingsize: string,
    calories: number | null,
    totalfat: string,
    saturatedfat: string,
    transfat: string,
    cholesterol: string,
    sodium: string,
    calcium: string,
    iron: string,
    totalcarbohydrate: string,
    dietaryfiber: string,
    totalsugars: string,
    addedsugars: string,
    protein: string,
    vitamind: string,
    potassium: string,
    allergens: string,
}

// MENU ITEMS

router.post("/menuitems", async (req, res) => {
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

router.get("/menuitems", async (req, res) => {
    try {
        const { hallid, date, meal } = req.query;

        const menuitems = await prisma.menuItem.findMany({
            where: {
                ...(hallid ? {hallid : Number(hallid)} : {}),
                ...(date ? {date : new Date(String(date))} : {}),
                ...(meal ? {meal : String(meal)} : {}),
            },
            orderBy: { station: "desc" },
        });

        res.json(menuitems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch menuitems" });
    }
})

// DINING HALLS

router.get("/dininghalls", async (req, res) => {
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
})

// NUTRITION FACTS

router.post("/nutrition", async (req, res) => {
    try {
        const nutrition_facts = req.body;

        await prisma.$transaction(
            nutrition_facts.map((nf: NutritionFacts) =>
                prisma.menuItemInfo.upsert({
                    where: {
                        name: nf.name
                    },
                    update: {
                    },
                    create: {
                        name: nf.name,
                        vegan: nf.vegan,
                        vegetarian: nf.vegetarian,
                        glutenfriendly: nf.glutenfriendly,
                        smartcheck: nf.smartcheck,
                        lesssodium: nf.lesssodium,
                        nogarliconion: nf.nogarliconion,
                        containsnuts: nf.containsnuts,
                        servingsize: nf.servingsize,
                        calories: nf.calories,
                        totalfat: nf.totalfat,
                        saturatedfat: nf.saturatedfat,
                        transfat: nf.transfat,
                        cholesterol: nf.cholesterol,
                        sodium: nf.sodium,
                        calcium: nf.calcium,
                        iron: nf.iron,
                        totalcarbohydrate: nf.totalcarbohydrate,
                        dietaryfiber: nf.dietaryfiber,
                        totalsugars: nf.totalsugars,
                        addedsugars: nf.addedsugars,
                        protein: nf.protein,
                        vitamind: nf.vitamind,
                        potassium: nf.potassium,
                        allergens: nf.allergens,
                    },
                })
            )
        );

        res.json({ ok: true});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ingest failed" });
    }
})

export default router;