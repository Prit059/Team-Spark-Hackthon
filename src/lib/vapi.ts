import Vapi from "@vapi-ai/web";

console.log("Loaded VAPI API Key:", process.env.NEXT_PUBLIC_VAPI_API_KEY);

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
