import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const session = await locals.auth();
    if (!session?.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const event = await prisma.event.findUnique({
            where: {
                id: params.id
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                registrations: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!event) {
            throw error(404, 'Event not found');
        }

        if (event.userId !== session.user.id) {
            throw error(403, 'Not authorized to view this event');
        }

        return {
            event: {
                ...event,
                date: event.date.toISOString(),
                createdAt: event.createdAt.toISOString(),
                updatedAt: event.updatedAt.toISOString(),
                registrations: event.registrations.map(reg => ({
                    ...reg,
                    createdAt: reg.createdAt.toISOString(),
                    updatedAt: reg.updatedAt.toISOString()
                }))
            }
        };
    } catch (err: any) {
        if (err.status === 404 || err.status === 403) {
            throw err;
        }
        console.error('Error loading event:', err);
        throw error(500, 'Failed to load event');
    }
}; 