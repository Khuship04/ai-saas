import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate"

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});


export async function POST(
    req: Request
) {
    try {
        const { userId } = await auth();
        const json = await req.json();

        console.log(JSON.stringify(json))
        const prompt = json.prompt;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }


        if (!prompt) {
            return new NextResponse("prompt is required", { status: 400 });

        }

        const response = await replicate.run(
            "ardianfe/music-gen-fn-200e:96af46316252ddea4c6614e31861876183b59dce84bad765f38424e87919dd85",
            {
                input: {
                    prompt: prompt,
                    duration: 8,
                    model_version: "melody",
                }
            }
        );


        return new Response(response as any);
    } catch (error) {
        console.log("[MUSIC_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }

}