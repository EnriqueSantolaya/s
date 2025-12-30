<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    onMount(() => {
        const timeout = setTimeout(() => {
            goto('/location');
        }, 1500);

        return () => clearTimeout(timeout);
    });
</script>

<main>
    <h1>Welcome to SolarFlow</h1>
    <p>Please wait while the website is loading</p>
</main>