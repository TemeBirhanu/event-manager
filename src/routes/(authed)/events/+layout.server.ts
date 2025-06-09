import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
    const tab = url.searchParams.get('tab') as 'all' | 'my' || 'all';
    return { tab };
}; 