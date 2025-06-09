<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { invalidateAll } from '$app/navigation';
    import EventCard from '$lib/components/EventCard.svelte';
    import { toast } from 'svelte-sonner';

    type PageData = {
        events: Array<{
            id: string;
            title: string;
            description: string;
            date: string;
            location: string;
            capacity: number;
            creatorId: string;
            isCreator: boolean;
            registrationId?: string;
            status?: 'registered' | 'checked-in' | 'cancelled';
            createdAt: Date;
            updatedAt: Date;
        }>;
        pagination: {
            currentPage: number;
            totalPages: number;
            total: number;
        };
        tab: 'all' | 'my';
        user: {
            id: string;
            email: string;
            name: string;
        } | null;
    };

    export let data: PageData;

    let showFullDescription: { [key: string]: boolean } = {};
    let isRegistering: { [key: string]: boolean } = {};

    function toggleDescription(eventId: string) {
        showFullDescription[eventId] = !showFullDescription[eventId];
        showFullDescription = showFullDescription;
    }

    async function handleDelete(eventId: string) {
        if (!data.user) return;
        
        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Event deleted successfully');
                await invalidateAll();
                if (data.tab === 'all') {
                    goto('events?tab=my');
                }
            } else {
                toast.error('Failed to delete event');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the event');
        }
    }

    async function handleRegister(eventId: string) {
        if (!data.user || isRegistering[eventId]) return;
        
        isRegistering[eventId] = true;
        try {
            const response = await fetch(`/api/events/${eventId}/register`, {
                method: 'POST'
            });

            if (response.ok) {
                toast.success('Successfully registered for the event');
                await invalidateAll();
                goto('events?tab=my');
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to register for event');
            }
        } catch (error) {
            toast.error('An error occurred while registering for the event');
        } finally {
            isRegistering[eventId] = false;
        }
    }

    async function handleUpdateStatus(eventId: string, registrationId: string, status: 'checked-in' | 'cancelled') {
        if (!data.user) return;

        try {
            const response = await fetch(`/api/events/${eventId}/registrations/${registrationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                toast.success(`Successfully ${status === 'checked-in' ? 'checked in' : 'cancelled registration'}`);
                await invalidateAll();
                if (data.tab === 'all') {
                    goto('events?tab=my');
                }
            } else {
                toast.error('Failed to update registration status');
            }
        } catch (error) {
            toast.error('An error occurred while updating registration status');
        }
    }
</script>

<div class="flex justify-end mb-6">
    <a
        href="events/create"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Event
    </a>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each data.events as event (event.id)}
        <div class="relative">
            <EventCard {event} />
            <div class="absolute top-2 right-2 flex space-x-2">
                {#if data.user && event.isCreator}
                    <a
                        href="events/{event.id}"
                        class="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
                        aria-label="Edit event"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </a>
                    <button
                        on:click={() => handleDelete(event.id)}
                        class="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
                        aria-label="Delete event"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                {:else if data.user && event.registrationId}
                    {#if event.status === 'registered'}
                        <button
                            on:click={() => handleUpdateStatus(event.id, event.registrationId!, 'checked-in')}
                            class="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
                            aria-label="Check in"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                        <button
                            on:click={() => handleUpdateStatus(event.id, event.registrationId!, 'cancelled')}
                            class="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
                            aria-label="Cancel registration"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    {:else if event.status === 'checked-in'}
                        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            Checked In
                        </span>
                    {:else if event.status === 'cancelled'}
                        <span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                            Cancelled
                        </span>
                    {/if}
                {:else if data.user}
                    <button
                        on:click={() => handleRegister(event.id)}
                        disabled={isRegistering[event.id]}
                        class="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                        aria-label="Register for event"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </button>
                {/if}
            </div>
        </div>
    {/each}
</div>

{#if data.pagination.totalPages > 1}
    <div class="mt-8 flex justify-center space-x-2">
        {#each Array(data.pagination.totalPages) as _, i}
            <a
                href="/events?tab={data.tab}&page={i + 1}"
                class="px-4 py-2 rounded-lg {data.pagination.currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors duration-200"
            >
                {i + 1}
            </a>
        {/each}
    </div>
{/if} 