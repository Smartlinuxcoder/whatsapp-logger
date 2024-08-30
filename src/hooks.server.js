// src/hooks.server.js
export async function handle({ event, resolve }) {
    const sessionId = event.cookies.get('session_id');

    if (sessionId) {
        event.locals.user = { username: 'user' };
    } else {
        event.locals.user = null;
    }

    return await resolve(event);
}
