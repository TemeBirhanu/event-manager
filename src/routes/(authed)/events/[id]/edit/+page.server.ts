import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { eventSchema } from '$lib/schemas';
import { prisma } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params, locals }) => {
    const session = await locals.auth();
    if (!session?.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const event = await prisma.event.findUnique({
            where: {
                id: params.id
            }
        });

        if (!event) {
            throw error(404, 'Event not found');
        }

        if (event.userId !== session.user.id) {
            throw error(403, 'Not authorized to edit this event');
        }

        // Transform the event data to match our form schema
        const formData = {
            ...event,
            date: event.date.toISOString().slice(0, 16) // Format for datetime-local input
        };

        const form = await superValidate(formData, zod(eventSchema));
        return { form };
    } catch (err: any) {
        if (err.status === 404 || err.status === 403) {
            throw err;
        }
        throw error(500, 'Failed to load event');
    }
};

export const actions: Actions = {
    default: async ({ request, params, locals }) => {
        const session = await locals.auth();
        if (!session?.user) {
            throw error(401, 'Unauthorized');
        }

        const form = await superValidate(request, zod(eventSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            const event = await prisma.event.findUnique({
                where: {
                    id: params.id
                }
            });

            if (!event) {
                throw error(404, 'Event not found');
            }

            if (event.userId !== session.user.id) {
                throw error(403, 'Not authorized to edit this event');
            }

            const eventData = {
                ...form.data,
                date: new Date(form.data.date)
            };

            await prisma.event.update({
                where: {
                    id: params.id
                },
                data: eventData
            });

            return {
                form,
                success: true,
                message: 'Event updated successfully!'
            };
        } catch (err: any) {
            if (err.status === 404 || err.status === 403) {
                throw err;
            }
            return fail(500, {
                form,
                message: 'Failed to update event'
            });
        }
    }
}; 