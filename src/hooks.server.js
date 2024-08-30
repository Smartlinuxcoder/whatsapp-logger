// src/hooks.server.js
import jwt from 'jsonwebtoken';

export async function handle({ event, resolve }) {
    const token = event.cookies.get('token');
    const jwtSecret = process.env.JWT_SECRET;

    if (token) {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            event.locals.user = { username: decoded.username };
        } catch (err) {
            // Token is invalid or expired
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    return await resolve(event);
}
