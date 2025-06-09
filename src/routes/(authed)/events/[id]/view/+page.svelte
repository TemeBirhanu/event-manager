<script lang="ts">
    import type { PageData } from './$types';
    import { format } from 'date-fns';

    export let data: PageData;
    const { event } = data;
</script>

<div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <!-- Header -->
                <div class="p-6 border-b border-gray-200">
                    <div class="flex justify-between items-start">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                            <p class="text-gray-600">
                                Created by {event.creatorName}
                            </p>
                        </div>
                        <div class="flex space-x-4">
                            <a
                                href="/events/{event.id}/edit"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Edit Event
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Event Details -->
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900 mb-4">Event Information</h2>
                            <dl class="space-y-4">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Date</dt>
                                    <dd class="mt-1 text-sm text-gray-900">
                                        {format(new Date(event.date), 'MMMM d, yyyy')}
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Time</dt>
                                    <dd class="mt-1 text-sm text-gray-900">
                                        {format(new Date(event.date), 'h:mm a')}
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Location</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{event.location}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Category</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{event.category}</dd>
                                </div>
                            </dl>
                        </div>
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                            <p class="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> 