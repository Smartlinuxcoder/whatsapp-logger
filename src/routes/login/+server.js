// src/routes/login/+server.js
import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
    const { username, password } = await request.json();

    const envUsername = process.env.USERNAME;
    const envPassword = process.env.PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (username === envUsername && password === envPassword) {
        // Create a JWT token
        const token = jwt.sign({ username }, jwtSecret, {
            expiresIn: '1h' // Token is valid for 1 hour
        });

        // Set the token as a secure, HTTP-only cookie
        cookies.set('token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60, // 1 hour
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'strict'
        });

        throw redirect(302, '/');
    } else {
        return {
            status: 401,
            body: {
                error: 'Invalid credentials'
            }
        };
    }
}
