import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { eventSchema } from '$lib/schemas';
import { createEvent } from '$lib/server/db';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, RequestEvent } from './$types';

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(eventSchema));
    return { form };
};

export const actions = {
    default: async ({ request, locals }: RequestEvent) => {
        const form = await superValidate(request, zod(eventSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await createEvent({
                ...form.data,
                creatorId: locals.user.id
            });
        } catch (error) {
            console.error('Error creating event:', error);
            return fail(500, { 
                form,
                message: 'An error occurred while creating the event'
            });
        }

        throw redirect(303, '/events?tab=my');
    }
};
