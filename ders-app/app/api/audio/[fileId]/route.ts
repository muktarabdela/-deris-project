// /app/api/audio/[fileId]/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ fileId: string }> }) {
    const { fileId } = await params;
    const botToken = process.env.BOT_TOKEN;

    if (!botToken) {
        console.error("BOT_TOKEN is not configured.");
        return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    // Step 1: Get the file path from Telegram's API
    const getFileUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`;

    try {
        const fileRes = await fetch(getFileUrl, {
            // Set a timeout for this specific fetch call if needed, though the new architecture is very fast
            // In Node.js v18+ you can use AbortController for this
            signal: AbortSignal.timeout(8000), // 8-second timeout
        });

        const fileData = await fileRes.json();

        if (!fileData.ok) {
            console.error("Telegram getFile API error:", fileData);
            return NextResponse.json(
                { error: `Failed to get file info. Reason: ${fileData.description}` },
                { status: fileData.error_code || 400 }
            );
        }

        // Step 2: Construct the direct download URL
        const filePath = fileData.result.file_path;
        const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;

        // Step 3: Return the direct URL to the client
        return NextResponse.json({ downloadUrl });

    } catch (error: any) {
        // Handle potential timeout error from the fetch signal
        if (error.name === 'TimeoutError') {
            console.error("Error fetching from Telegram API: Request timed out.");
            return NextResponse.json({ error: "Could not retrieve file details from the source in time." }, { status: 504 }); // 504 Gateway Timeout
        }

        console.error("Error in audio API route:", error);
        return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
    }
}