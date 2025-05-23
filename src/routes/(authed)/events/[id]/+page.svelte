<script lang="ts">
    import type { PageData } from './$types';
    import Navbar from '$lib/components/Navbar.svelte';
    import { page } from '$app/stores';

    export let data: PageData;
    const { event } = data;
</script>

<div class="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
    <Navbar />

    <div class="flex-1 container mx-auto px-6 py-8">
        <div class="max-w-4xl mx-auto">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-3xl font-bold text-gray-800">{event.title}</h1>
                <div class="flex items-center space-x-4">
                    <a 
                        href="/events" 
                        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                        Back to Events
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </a>
                    {#if $page.data.session?.user?.id === event.userId}
                        <a 
                            href="/events/{event.id}/edit" 
                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                            Edit Event
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </a>
                    {/if}
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                {#if event.imageUrl}
                    <img src={event.imageUrl} alt={event.title} class="w-full h-64 object-cover" />
                {:else}
                    <div class="w-full h-64 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                        <span class="text-white text-4xl font-bold">{event.title[0]}</span>
                    </div>
                {/if}

                <div class="p-8">
                    <span class="text-gray-500 block mb-4">
                        {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}
                    </span>
                    <p class="text-gray-600 mb-8">{event.description}</p>
                    <div class="grid grid-cols-2 gap-6 mb-8">
                        <div class="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span class="text-gray-600">{event.location}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span class="text-gray-600">{event.capacity} spots</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> 