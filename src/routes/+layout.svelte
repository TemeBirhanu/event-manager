<script>
  import "../app.css";
  import { Toaster } from 'svelte-sonner';
  let { children } = $props();
</script>
<main>
{@render children()}
</main>
<Toaster />