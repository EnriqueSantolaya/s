<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let projects: any[] = [];
    let error: string | null = null;

    async function fetchProjects() {
        try {
            const res = await fetch('/projects');
            if (!res.ok) {
                const data = await res.json();
                error = data.error ?? 'Error al obtener proyectos';
                return;
            }
            projects = await res.json();
        } catch (e) {
            error = 'Error de conexión';
        }
    }

    onMount(() => {
        fetchProjects();
    });

    function goBack() {
        history.back(); // o goto('/pagina-anterior') si quieres ruta fija
    }
</script>

<div class="projects-page">
    <button class="close-btn" on:click={goBack}>×</button>

    <h2>Lista proyectos</h2>

    {#if error}
        <p style="color: red;">{error}</p>
    {:else if projects.length === 0}
        <p>No hay proyectos guardados.</p>
    {:else}
        <ul>
            {#each projects as p}
                <li>
                    Proyecto: {p.id} | Energía: {p.energia ? Math.round(p.energia / 1000) + 'k' : 'N/A'}
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
.projects-page {
    position: relative;
    padding: 20px;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    background: transparent;
    border: none;
    cursor: pointer;
}
</style>
