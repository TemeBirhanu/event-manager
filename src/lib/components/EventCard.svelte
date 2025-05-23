<script lang="ts">
    import type { z } from 'zod';
    import type { eventSchema } from '$lib/schemas';

    type Event = z.infer<typeof eventSchema> & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    };

    export let event: Event;
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="w-full h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
        <span class="text-white text-2xl font-bold">{event.title[0]}</span>
    </div>
    
    <div class="p-6">
        <span class="text-gray-500 text-sm block mb-2">
            {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}
        </span>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
        <p class="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
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
                href="/events/{event.id}" 
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </a>
        </div>
    </div>
</div> 