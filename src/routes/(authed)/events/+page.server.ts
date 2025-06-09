import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllEvents, getUserEvents, getUserRegisteredEvents } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, url }) => {
    const tab = url.searchParams.get('tab') || 'all';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = 9;
    const offset = (page - 1) * limit;

    let events;
    let total;

    try {
        if (tab === 'my') {
            const [createdEvents, registeredEvents] = await Promise.all([
                getUserEvents(locals.user.id),
                getUserRegisteredEvents(locals.user.id)
            ]);

            const uniqueEvents = new Map();
            
            createdEvents.forEach(event => {
                uniqueEvents.set(event.id, { ...event, isCreator: true });
            });

            registeredEvents.forEach(event => {
                if (!uniqueEvents.has(event.id)) {
                    uniqueEvents.set(event.id, { ...event, isCreator: false });
                }
            });
            events = Array.from(uniqueEvents.values());
            total = events.length;
            events = events.slice(offset, offset + limit);
        } else {
            const allEvents = await getAllEvents(locals.user?.id);
            events = allEvents.map(event => ({
                ...event,
                isCreator: event.creator_id === locals.user?.id
            }));
            total = events.length;
            events = events.slice(offset, offset + limit);
        }

        return {
            events,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total
            },
            tab,
            user: locals.user
        };
    } catch (err) {
        console.error('Error loading events:', err);
        throw error(500, 'Failed to load events');
    }
}; 