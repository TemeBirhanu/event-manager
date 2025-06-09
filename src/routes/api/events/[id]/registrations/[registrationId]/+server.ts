import { error, json } from '@sveltejs/kit';
import { updateRegistrationStatus } from '$lib/server/db';
import type { RequestEvent } from '@sveltejs/kit';

export async function PATCH({ params, request, locals }: RequestEvent) {
    if (!params.id || !params.registrationId) {
        throw error(400, 'Event ID and Registration ID are required');
    }

    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const { status } = await request.json();
        
        if (!status || !['checked-in', 'cancelled'].includes(status)) {
            throw error(400, 'Invalid status. Must be either "checked-in" or "cancelled"');
        }

        const registration = await updateRegistrationStatus(params.registrationId, status);
        return json(registration);
    } catch (err: any) {
        console.error('Error updating registration status:', err);
        if (err.status) {
            throw err;
        }
        throw error(500, err.message || 'Failed to update registration status');
    }
} 