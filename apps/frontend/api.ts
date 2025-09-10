import Constants from 'expo-constants';

export interface DiningHall {
    id: number,
    name: string,
    breakfaststart: string,
    breakfastend: string,
    lunchstart: string,
    lunchend: string,
    dinnerstart: string,
    dinnerend: string,
    haslatenight: boolean,
    hasgrabngo: boolean,
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

    const res = await fetch(`${baseURL}/api/ingest/dininghalls?${params.toString()}`);
    return res.json();
}