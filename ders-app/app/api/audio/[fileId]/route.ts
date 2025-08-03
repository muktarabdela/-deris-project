import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { fileId: string } }) {
    const fileId = params.fileId;
    const botToken = process.env.BOT_TOKEN;

    if (!botToken) {
        return NextResponse.json({ error: "BOT_TOKEN is not configured" }, { status: 500 });
    }

    // Step 1: Call getFile API to get the file_path
    const fileApiUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`;

    const fileRes = await fetch(fileApiUrl);
    const fileData = await fileRes.json();

    if (!fileData.ok) {
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

    return new NextResponse(audioBuffer, {
        headers: {
            'Content-Type': 'audio/ogg',
            'Content-Disposition': `inline; filename="${filePath.split('/').pop()}"`,
            'Cache-Control': 'public, max-age=31536000',
        },
    });
}
