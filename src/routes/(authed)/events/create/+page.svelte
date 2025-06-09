<script lang="ts">
    import EventForm from '$lib/components/EventForm.svelte';
    import type { PageData } from './$types';
    import type { SuperValidated } from 'sveltekit-superforms';
    import type { z } from 'zod';
    import { eventSchema } from '$lib/schemas';

    type EventFormData = z.infer<typeof eventSchema>;
    type FormResult = EventFormData & { message?: string };

    export let data: { form: SuperValidated<FormResult> };
</script>

<div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-800 mb-8">Create New Event</h1>
            <div class="bg-white rounded-lg shadow-md p-6">
                <EventForm {data} />
            </div>
        </div>
    </div>
</div>
