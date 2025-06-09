<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';
    import type { SuperForm, SuperValidated } from 'sveltekit-superforms';
    import type { z } from 'zod';
    import type { eventSchema } from '$lib/schemas';
    import FormInput from './FormInput.svelte';
    import Alert from './Alert.svelte';

    type EventFormData = z.infer<typeof eventSchema>;
    type FormResult = EventFormData & { success?: boolean; message?: string };

    export let data: { form: SuperValidated<FormResult> };
    export let submitLabel: string = 'Create Event';

    const { form, errors, enhance, submitting } = superForm(data.form, {
        resetForm: true
    });
</script>

<form method="POST" use:enhance class="space-y-6">
    {#if $form.message}
        <Alert message={$form.message} type={$form.success ? 'success' : 'error'} />
    {/if}

    <FormInput
        id="title"
        name="title"
        label="Event Title"
        bind:value={$form.title}
        errors={$errors.title}
        required
    />

    <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
            id="description"
            name="description"
            bind:value={$form.description}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            rows="4"
            required
        ></textarea>
        {#if $errors.description}
            <p class="mt-1 text-sm text-red-500">{$errors.description.join(', ')}</p>
        {/if}
    </div>

    <FormInput
        id="date"
        name="date"
        type="datetime-local"
        label="Event Date"
        bind:value={$form.date}
        errors={$errors.date}
        required
    />

    <FormInput
        id="location"
        name="location"
        label="Location"
        bind:value={$form.location}
        errors={$errors.location}
        required
    />

    <FormInput
        id="capacity"
        name="capacity"
        type="number"
        label="Capacity"
        bind:value={$form.capacity}
        errors={$errors.capacity}
        required
    />

    <button
        type="submit"
        class="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
        disabled={$submitting}
    >
        {#if $submitting}
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
        {:else}
            <span>{submitLabel}</span>
        {/if}
    </button>
</form> 