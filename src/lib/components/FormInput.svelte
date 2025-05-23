<script lang="ts">
    export let id: string;
    export let name: string;
    export let label: string;
    export let type: string = 'text';
    export let value: string = '';
    export let errors: string[] = [];
    export let required: boolean = false;
    export let placeholder: string = '';
</script>

<div>
    <label for={id} class="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
        {id}
        {name}
        {type}
        bind:value
        {required}
        {placeholder}
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
    />
    {#if errors?.length > 0}
        <p class="mt-1 text-sm text-red-500">{errors.join(', ')}</p>
    {/if}
</div> 