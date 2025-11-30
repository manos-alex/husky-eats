import Constants from 'expo-constants';

export interface DiningHall {
    id: number,
    name: string,
    wdbreakfast: string | null,
    wdlunch: string | null,
    wddinner: string | null,
    wesatbreakfast: string | null,
    wesunbreakfast: string | null,
    webrunch: string | null,
    wedinner: string | null,
    latenight: string | null,
    haslatenight: boolean,
    hasgrabngo: boolean,
}

export interface MenuItem {
    id: number,
    name: string,
    meal: string,
    hallid: number,
    date: Date,
    station: string,
}

export interface NutritionFacts {
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

export interface ItemMatch {
    id: string,
    name: string,
    servings: number,
}

const baseURL: string = 
        (Constants.expoConfig?.extra?.API_BASEURL as string) ||
        "http://172.27.30.61:4000";

export async function checkAPI() {
    const res = await fetch(`${baseURL}`);
    if (!res.ok) throw new Error("Could not connect to API");
    return res.json() as Promise<{ ok: boolean}>;
}

export async function getDiningHalls({ id } : {id?: number}) {
    let path = ""
    if (id) path = `${baseURL}/dininghall/${id}`
    else path = `${baseURL}/dininghall`
    const res = await fetch(path);
    return res.json();
}

export async function getMenuItems({ meal, hallid, date } : {meal?: string, hallid?: number, date?: Date}) {
    const params = new URLSearchParams();
    if (meal) params.append("meal", meal);
    if (date) params.append("date", date.toISOString().split("T")[0]);
    if (hallid) params.append("hallid", hallid.toString());

    const res = await fetch(`${baseURL}/menu?${params.toString()}`);
    return res.json();
}

export async function getNutritionFacts({ id } : {id?: number}) {
    const res = await fetch(`${baseURL}/menuitem/${id}`);
    return res.json();
}
