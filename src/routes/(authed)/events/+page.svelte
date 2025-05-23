<script lang="ts">
    import type { PageData } from './$types';
    import EventCard from '$lib/components/EventCard.svelte';
    import Navbar from '$lib/components/Navbar.svelte';
    import { page } from '$app/stores';

    export let data: PageData;
</script>

<div class="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
    <Navbar />

    <div class="flex-1 container mx-auto px-6 py-8">
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Events</h1>
            <a 
                href="/events/create" 
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
                Create Event
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </a>
        </div>

        {#if data.events.length === 0}
            <div class="text-center py-12">
                <h3 class="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p class="text-gray-500">Get started by creating your first event!</p>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each data.events as event (event.id)}
                    <EventCard {event} />
                {/each}
            </div>
        {/if}
    </div>
</div> 