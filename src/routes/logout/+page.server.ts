import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export const actions = {
    default: async ({ cookies }: RequestEvent) => {
        // Clear the session cookie
        cookies.delete('sessionId', { path: '/' });
        
        // Redirect to login page
        throw redirect(303, '/login');
    }
};
