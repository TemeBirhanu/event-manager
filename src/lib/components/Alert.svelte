<script lang="ts">
    export let message: string;
    export let type: 'success' | 'error' = 'success';
</script>
 
{#if message}
    <div class="mb-4 p-4 rounded-lg {type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}">
        {message}
    </div>
{/if} 