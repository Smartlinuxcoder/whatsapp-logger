// src/routes/login/+server.js
import { redirect } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
    const { username, password } = await request.json();

    // Here you'd normally validate the user with a database
    if (username === 'user' && password === 'pass') {
        // Set a cookie to store the session
        cookies.set('session_id', 'your-session-id', {
            httpOnly: true, // Cookie cannot be accessed via JavaScript on the client side
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

        throw redirect(302, '/');
    }

    return {
        status: 401,
        body: {
            error: 'Invalid credentials'
        }
    };
}
