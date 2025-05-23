import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    if (!session?.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const events = await prisma.event.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                date: 'asc'
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return {
            events: events.map(event => ({
                ...event,
                date: event.date.toISOString()
            }))
        };
    } catch (err) {
        console.error('Error loading events:', err);
        throw error(500, 'Failed to load events');
    }
}; 