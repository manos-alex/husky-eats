import Constants from 'expo-constants';

const baseURL: string = 
        (Constants.expoConfig?.extra?.API_BASEURL as string) ||
        "http://172.27.30.61:4000";

export async function checkAPI() {
    const res = await fetch(`${baseURL}/api`);
    if (!res.ok) throw new Error("Could not connect to API");
    return res.json() as Promise<{ ok: boolean}>;
}