import express from "express";
import { prisma } from "../prisma.js";
import { requireApiKey } from "../middleware.js";

const router = express.Router();

interface NutritionFacts {
    id: number,
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
    totalfat_g: number | null,
    saturatedfat_g: number | null,
    transfat_g: number | null,
    cholesterol_mg: number | null,
    sodium_mg: number | null,
    calcium_mg: number | null,
    iron_mg: number | null,
    totalcarbohydrate_g: number | null,
    dietaryfiber_g: number | null,
    totalsugars_g: number | null,
    addedsugars_g: number | null,
    protein_g: number | null,
    vitamind_mcg: number | null,
    potassium_mg: number | null,
    allergens: string,
}

router.post("/nutrition", requireApiKey, async (req, res) => {
    try {
        const nutrition_facts = req.body;

        await prisma.$transaction(
            nutrition_facts.map((nf: NutritionFacts) =>
                prisma.menuItemInfo.upsert({
                    where: {
                        id: nf.id,
                    },
                    update: {
                    },
                    create: {
                        id: nf.id,
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
                        totalfat_g: nf.totalfat_g,
                        saturatedfat_g: nf.saturatedfat_g,
                        transfat_g: nf.transfat_g,
                        cholesterol_mg: nf.cholesterol_mg,
                        sodium_mg: nf.sodium_mg,
                        calcium_mg: nf.calcium_mg,
                        iron_mg: nf.iron_mg,
                        totalcarbohydrate_g: nf.totalcarbohydrate_g,
                        dietaryfiber_g: nf.dietaryfiber_g,
                        totalsugars_g: nf.totalsugars_g,
                        addedsugars_g: nf.addedsugars_g,
                        protein_g: nf.protein_g,
                        vitamind_mcg: nf.vitamind_mcg,
                        potassium_mg: nf.potassium_mg,
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
        const { id, name } = req.query;

        const nutrition_facts = await prisma.menuItemInfo.findFirst({
            where: {
                ...(id ? {id : Number(id)} : {}),
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