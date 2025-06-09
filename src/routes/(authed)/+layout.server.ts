import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';


export const load: LayoutServerLoad = async ({ locals, url }) => {
    if (!locals.user) {
       redirect(303, `/login?redirectTo=${url.pathname}`);
    }
    return {};
}