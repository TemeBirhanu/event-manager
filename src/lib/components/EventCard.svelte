<script lang="ts">
    import type { z } from 'zod';
    import type { eventSchema } from '$lib/schemas';
    import { page } from '$app/stores';
    import { toast } from 'svelte-sonner';
    import { goto } from '$app/navigation';

    type Event = z.infer<typeof eventSchema> & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        creatorId: string;
        registrationId?: string;
        status?: 'registered' | 'checked-in' | 'cancelled';
    };

    export let event: Event;
   

    let isLoading = false;

    $: isRegistered = event.status === 'registered' || event.status === 'checked-in';

    async function handleRegister() {
        if (isLoading) return;
        isLoading = true;

        try {
            const response = await fetch(`/api/events/${event.id}/register`, {
                method: 'POST'
            });

            if (response.ok) {
                toast.success('Successfully registered for the event');
                goto('events?tab=my');
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to register for the event');
            }
        } catch (error) {
            toast.error('An error occurred while registering for the event');
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
    <div class="w-full h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
        <span class="text-white text-2xl font-bold">{event.title[0]}</span>
    </div>
    
    <div class="p-6 flex flex-col flex-grow">
        <span class="text-gray-500 text-sm block mb-2">
            {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}
        </span>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
        <p class="text-gray-600 mb-4 line-clamp-2 flex-grow">
            {event.description}
        </p>
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-gray-600">{event.location}</span>
            </div>
            <span class="text-sm text-gray-500">{event.capacity} spots</span>
        </div>
        <div class="mt-4 flex items-center justify-between">
            <a 
                href="/events/{event.id}/view" 
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </a>
            {#if event.creatorId !== $page.data.session?.user?.id}
                <button
                    on:click={handleRegister}
                    disabled={isLoading || isRegistered}
                    class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {isRegistered 
                        ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                        : 'text-white bg-blue-600 hover:bg-blue-700'}"
                >
                    {#if isLoading}
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                    {:else if isRegistered}
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Registered
                    {:else}
                        Register
                    {/if}
                </button>
            {/if}
        </div>
    </div>
</div> 