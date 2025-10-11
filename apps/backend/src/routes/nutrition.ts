import express from "express";
import { prisma } from "../prisma.js";
import { requireApiKey } from "../middleware.js";

const router = express.Router();

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

router.post("/nutrition", requireApiKey, async (req, res) => {
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
});

router.get("/nutrition", async (req, res) => {
    try {
        const { name } = req.query;

        const nutrition_facts = await prisma.menuItemInfo.findFirst({
            where: {
                ...(name ? {name : String(name).toLowerCase()} : {}),
            }
        });

        if (nutrition_facts === null) res.status(500).json({ error: "Item not found" })
    
        res.json(nutrition_facts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch nutrition facts" });
    }
});

export default router;