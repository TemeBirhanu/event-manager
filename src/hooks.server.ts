import { prisma } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import type { User } from '@prisma/client';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get('sessionId');

    if (sessionId) {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: { user: true }
        });

        if (session && session.expiresAt > new Date()) {
            event.locals.user = session.user;
        } else if (session) {
            // Delete expired session
            await prisma.session.delete({
                where: { id: sessionId }
            });
            event.locals.user = null;
        }
    }

    return resolve(event);
};

declare global {
    namespace App {
        interface Locals {
            auth(): Promise<{ user: any } | null>;
        }
    }
}
