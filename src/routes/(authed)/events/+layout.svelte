<script lang="ts">
    import { page } from '$app/stores';
    import VerticalNav from '$lib/components/VerticalNav.svelte';
    import type { PageData } from './$types';

    type LayoutData = {
        tab: 'all' | 'my';
    };

    export let data: LayoutData;
</script>

<div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Events</h1>
        </div>

        <div class="flex gap-8">
            <VerticalNav activeTab={data.tab} />
            <div class="flex-1">
                <slot />
            </div>
        </div>
    </div>
</div>
