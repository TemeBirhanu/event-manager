import { error } from '@sveltejs/kit';
import { deleteEvent } from '$lib/server/db';
import type { RequestEvent } from '@sveltejs/kit';

export async function DELETE({ params, locals }: RequestEvent) {
    if (!params.id) {
        throw error(400, 'Event ID is required');
    }

    try {
        await deleteEvent(params.id);
        return new Response(null, { status: 204 });
    } catch (err) {
        console.error('Error deleting event:', err);
        throw error(500, 'Failed to delete event');
    }
} 