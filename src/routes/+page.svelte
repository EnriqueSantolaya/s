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

    <p class="loading-text">
        Cargando<span class="dots">...</span>
    </p>
</main>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
    :global(html, body) {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    .loading-container {
        font-family: 'Poppins', system-ui, sans-serif;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: linear-gradient(
            to bottom,
            #a5ddff 0%,
            #eaf7ff 60%,
            #ffffff 100%
        );
        color: #0f172a;
        text-align: center;
    }

    .title {
        font-size: 3.2rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        letter-spacing: 0.05em;
    }

    .sun {
        position: relative;
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
        margin-bottom: 1.2rem;
        animation: pulse 1.8s ease-in-out infinite;
    }

    .sun::after {
        content: '';
        position: absolute;
        inset: -25px;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgba(253,224,71,0.25) 40%,
            transparent 70%
        );
        animation: rotate 8s linear infinite;
    }

    .loading-text {
        font-size: 1rem;
        opacity: 0.75;
    }

    .loading-text {
        font-size: 1rem;
        opacity: 0.75;
        letter-spacing: 0.08em;
    }

    .dots {
        animation: dots 1.5s steps(4, end) infinite;
    }

    @keyframes dots {
        0% { content: ''; }
        25% { content: '.'; }
        50% { content: '..'; }
        75% { content: '...'; }
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>