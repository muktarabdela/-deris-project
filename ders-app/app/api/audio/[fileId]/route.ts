import { NextRequest, NextResponse } from 'next/server';

// Helper function to get MIME type from file extension
const getMimeType = (filePath: string): string => {
    const extension = filePath.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'mp3':
            return 'audio/mpeg';
        case 'ogg':
        case 'oga': // .oga is often used for ogg voice notes
            return 'audio/ogg';
        case 'wav':
            return 'audio/wav';
        case 'm4a':
            return 'audio/mp4';
        case 'mp4':
            return 'video/mp4'; // Also works for audio
        default:
            // A sensible fallback
            return 'application/octet-stream';
    }
}

export async function GET(
    request: NextRequest,
    context: { params: { fileId: string } }
) {
    const fileId = context.params.fileId;
    const botToken = process.env.BOT_TOKEN;

    if (!botToken) {
        return NextResponse.json({ error: "BOT_TOKEN is not configured" }, { status: 500 });
    }

    // Step 1: Call getFile API to get the file_path
    const fileApiUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`;

    try {
        const fileRes = await fetch(fileApiUrl);
        const fileData = await fileRes.json();

        if (!fileData.ok) {
            console.error("Telegram getFile API error:", fileData);
            return NextResponse.json({ error: "Failed to get file path from Telegram" }, { status: 400 });
        }

        const filePath = fileData.result.file_path;

        // Step 2: Download the file from Telegram
        const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
        const audioRes = await fetch(downloadUrl);

        if (!audioRes.ok) {
            return NextResponse.json({ error: "Failed to download file from Telegram" }, { status: 500 });
        }

        const audioBuffer = await audioRes.arrayBuffer();

        // Step 3: Determine the correct Content-Type
        const mimeType = getMimeType(filePath);

        // Step 4: Return the response with the dynamic Content-Type
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': `inline; filename="${filePath.split('/').pop()}"`,
                'Cache-Control': 'public, max-age=31536000',
            },
        });

    } catch (error) {
        console.error("Error in audio API route:", error);
        return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
    }
}