<script lang="ts">
    import type { PageData } from './$types';
    import EventForm from '$lib/components/EventForm.svelte';
    import Navbar from '$lib/components/Navbar.svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    export let data: PageData;
</script>

<div class="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
    <Navbar />

    <div class="flex-1 container mx-auto px-6 py-8">
        <div class="max-w-2xl mx-auto">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-3xl font-bold text-gray-800">Edit Event</h1>
                <a 
                    href="/events/{$page.params.id}" 
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                    Back to Event
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </a>
            </div>

            <div class="bg-white rounded-2xl shadow-xl p-8">
                <EventForm {data} submitLabel="Update Event" />
            </div>
        </div>
    </div>
</div> 