import { OpenAI } from "openai";

export const DEEP_SEEK_MODEL = "deepseek-chat";

export const openai = new OpenAI({
    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com/v1",
    dangerouslyAllowBrowser: true,
});
