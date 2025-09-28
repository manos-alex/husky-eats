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

const baseURL: string = 
        (Constants.expoConfig?.extra?.API_BASEURL as string) ||
        "http://172.27.30.61:4000";

export async function checkAPI() {
    const res = await fetch(`${baseURL}/api`);
    if (!res.ok) throw new Error("Could not connect to API");
    return res.json() as Promise<{ ok: boolean}>;
}

export async function getDiningHalls({ id, name } : {id?: number, name?: string}) {
    const params = new URLSearchParams();
    if (id) params.append("id", id.toString());
    if (name) params.append("name", name);

    const res = await fetch(`${baseURL}/api/dininghall?${params.toString()}`);
    return res.json();
}

export async function getMenuItems({ meal, hallid, date } : {meal?: string, hallid?: number, date?: Date}) {
    const params = new URLSearchParams();
    if (meal) params.append("meal", meal);
    if (date) params.append("date", date.toISOString().split("T")[0]);
    if (hallid) params.append("hallid", hallid.toString());

    const res = await fetch(`${baseURL}/api/menuitem?${params.toString()}`);
    return res.json();
}

export async function getNutritionFacts({ name } : {name?: string}) {
    const params = new URLSearchParams();
    if (name) params.append("name", name);

    const res = await fetch(`${baseURL}/api/nutrition?${params.toString()}`);
    return res.json();
}
