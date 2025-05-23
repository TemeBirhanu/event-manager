<script lang="ts">
    import type { LayoutData } from './$types';
    import Navbar from '$lib/components/Navbar.svelte';

    export let data: LayoutData;
</script>

<slot /> 