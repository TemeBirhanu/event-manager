import { error, json } from '@sveltejs/kit';
import { isUserRegisteredForEvent } from '$lib/server/db';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET({ params, locals }: RequestEvent) {
    if (!params.id) {
        throw error(400, 'Event ID is required');
    }

    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const isRegistered = await isUserRegisteredForEvent(locals.user.id, params.id);
        return json({ isRegistered });
    } catch (err: any) {
        console.error('Error checking registration status:', err);
        throw error(500, 'Failed to check registration status');
    }
} 