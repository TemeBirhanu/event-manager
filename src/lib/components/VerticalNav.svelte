<script lang="ts">
    import { page } from '$app/stores';
    
    export let activeTab: 'all' | 'my' = 'all';
</script>

<nav class="w-64 bg-white shadow-lg rounded-lg p-4">
    <div class="space-y-2">
        <a
            href="/events?tab=all"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 {activeTab === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>All Events</span>
        </a>
        
        <a
            href="/events?tab=my"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 {activeTab === 'my' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>My Events</span>
        </a>
    </div>
</nav> 