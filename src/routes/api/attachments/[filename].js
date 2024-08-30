import fs from 'fs';
import path from 'path';

export async function GET({ params }) {
    const { filename } = params;
    const filePath = path.resolve('static/attachments', filename);

    try {
        // Ensure the file exists
        if (fs.existsSync(filePath)) {
            // Read the file from the disk
            const file = fs.readFileSync(filePath);
            
            // Determine the content type based on the file extension
            const extension = path.extname(filename).toLowerCase();
            let contentType = 'application/octet-stream';
            
            // Set appropriate content types for common file extensions
            if (extension === '.png') contentType = 'image/png';
            else if (extension === '.jpg' || extension === '.jpeg') contentType = 'image/jpeg';
            else if (extension === '.gif') contentType = 'image/gif';
            else if (extension === '.svg') contentType = 'image/svg+xml';
            else if (extension === '.pdf') contentType = 'application/pdf';
            else if (extension === '.txt') contentType = 'text/plain';
            else if (extension === '.html') contentType = 'text/html';
            else if (extension === '.webp') contentType = 'image/webp'; // Added webp
            else if (extension === '.mp4') contentType = 'video/mp4'; // Added mp4
            else if (extension === '.mp3') contentType = 'audio/mpeg'; // Added mp3

            return new Response(file, {
                headers: {
                    'Content-Type': contentType,
                },
            });
        } else {
            return new Response('File not found', { status: 404 });
        }
    } catch (err) {
        return new Response('Error reading file', { status: 500 });
    }
}
