import type { Handle } from '@sveltejs/kit';
import { findSessionById } from '$lib/server/db';

type User = {
    id: string;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
};

export const handle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
        return new Response(null, { status: 204 });
    }

    const sessionId = event.cookies.get('sessionId');

    if (sessionId) {
        const session = await findSessionById(sessionId);
        if (session) {
            event.locals.user = {
                id: session.user_id,
                email: session.email,
                name: session.name,
                password: session.password,
                createdAt: new Date(session.created_at),
                updatedAt: new Date(session.updated_at)
            };
        }
    }

    return resolve(event);
};

declare global {
    namespace App {
        interface Locals {
            user: User | null;
        }
    }
}
