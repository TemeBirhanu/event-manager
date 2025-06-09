import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { eventSchema } from '$lib/schemas';
import { getEventById, updateEvent } from '$lib/server/db';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const event = await getEventById(params.id);
    if (!event) {
        throw redirect(303, 'events');
    }
const formattedDate = new Date(event.date).toISOString().slice(0, 16);
    const form = await superValidate({
        title: event.title,
        description: event.description,
        date: formattedDate,
        location: event.location,
        capacity: event.capacity
    }, zod(eventSchema));

    return { form, event };
};


export const actions = {
    default: async ({ request, params, locals }: RequestEvent) => {
        const form = await superValidate(request, zod(eventSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await updateEvent(params.id, {
                ...form.data
            });

            
        } catch (error) {
            if (error instanceof Error && error.message.includes('redirect')) {
                throw error;
            }
            console.error('Error updating event:', error);
            return fail(500, { 
                form,
                message: 'An error occurred while updating the event'
            });
        }
        throw redirect(303, '/events?tab=my');
    }
}; 
