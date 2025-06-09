import { error } from '@sveltejs/kit';
import { getEventWithCreator } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const event = await getEventWithCreator(params.id);
    
    if (!event) {
        throw error(404, 'Event not found');
    }

    return { event };
}; 