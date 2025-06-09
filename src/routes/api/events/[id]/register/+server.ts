import { error, json } from '@sveltejs/kit';
import { registerForEvent, isUserRegisteredForEvent } from '$lib/server/db';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ params, locals }: RequestEvent) {
    if (!params.id) {
        throw error(400, 'Event ID is required');
    }

    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        // Check if user is already registered
        const isRegistered = await isUserRegisteredForEvent(locals.user.id, params.id);
        if (isRegistered) {
            throw error(400, 'You are already registered for this event');
        }

        // Register user for the event
        const registration = await registerForEvent(locals.user.id, params.id);
        return json({
            ...registration,
            status: 'registered'
        });
    } catch (err: any) {
        console.error('Error registering for event:', err);
        if (err.status) {
            throw err;
        }
        throw error(500, err.message || 'Failed to register for event');
    }
} 