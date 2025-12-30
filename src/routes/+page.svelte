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

<main class="loading-container">
    <h1 class="title">SolarFlow</h1>

    <div class="sun"></div>

    <p class="loading-text">Cargando...</p>
</main>

<style>
    :global(html, body) {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    .loading-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: linear-gradient(
            to bottom,
            #bde9ff 0%,
            #eaf7ff 100%
        );
        color: #0f172a;
        text-align: center;
    }

    .title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 2rem;
    }

    .sun {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: radial-gradient(
            circle at 30% 30%,
            #fffbd1,
            #fde047,
            #f59e0b
        );
        box-shadow:
            0 0 30px rgba(253, 224, 71, 0.9),
            0 0 60px rgba(253, 224, 71, 0.6);
        margin-bottom: 1rem;
        animation: pulse 1.8s ease-in-out infinite;
    }

    .loading-text {
        font-size: 1rem;
        opacity: 0.75;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
</style>