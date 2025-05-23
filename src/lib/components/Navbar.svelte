<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { signOut } from '@auth/sveltekit/client';

    const handleSignOut = async () => {
        await signOut();
        goto('/');
    };
</script>

<nav class="bg-white shadow-sm">
    <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-8">
                <a href="/" class="text-xl font-bold text-gray-800">Event Manager</a>
                {#if $page.data.session}
                    <div class="hidden md:flex items-center space-x-4">
                        <a 
                            href="/events" 
                            class="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                            class:font-medium={$page.url.pathname.startsWith('/events')}
                        >
                            Events
                        </a>
                    </div>
                {/if}
            </div>

            <div class="flex items-center space-x-4">
                {#if $page.data.session}
                    <button
                        on:click={handleSignOut}
                        class="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                        Sign Out
                    </button>
                {:else}
                    <a 
                        href="/login" 
                        class="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        class:font-medium={$page.url.pathname === '/login'}
                    >
                        Login
                    </a>
                    <a 
                        href="/register" 
                        class="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        class:font-medium={$page.url.pathname === '/register'}
                    >
                        Register
                    </a>
                {/if}
            </div>
        </div>
    </div>
</nav> 