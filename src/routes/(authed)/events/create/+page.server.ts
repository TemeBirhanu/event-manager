import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { eventSchema } from '$lib/schemas';
import { prisma } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const form = await superValidate(zod(eventSchema));
    return { form };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) {
            throw new Error('Unauthorized');
        }

        const form = await superValidate(request, zod(eventSchema));
        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            const eventData = {
                ...form.data,
                date: new Date(form.data.date),
                userId: session.user.id
            };

            const event = await prisma.event.create({
                data: eventData
            });

            return {
                form,
                success: true,
                message: 'Event created successfully'
            };
        } catch (error) {
            console.error('Error creating event:', error);
            return fail(500, {
                form,
                message: 'Failed to create event'
            });
        }
    }
}; 