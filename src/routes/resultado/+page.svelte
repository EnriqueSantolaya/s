<script lang="ts">
    import { configAvanzadaStore } from '$lib/stores/configAvanzada';
    import { latitudStore } from '$lib/stores/latitud';
    import { obstaclesStore } from '$lib/stores/obstacles';
    import { onMount } from 'svelte';
    
    const cavanzada = configAvanzadaStore;
    const latitud = latitudStore;
    const obstacles = obstaclesStore;

    let isLoggedIn = false;

    // Resultado de mejor posición
    let bestPosition: { altura: number; acimut: number; energia: number } | null = null;
    let errorMessage: string | null = null;

    async function fetchBestPosition() {
        try {
            const response = await fetch('/api/get-best-position', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitud: $latitud,
                    altura: $cavanzada.altura ?? undefined,
                    acimut: $cavanzada.acimut ?? undefined,
                    meses: $cavanzada.meses ?? undefined,
                    obstacles: $obstacles
                })
            });

            const data = await response.json();
            if (!response.ok) {
                errorMessage = data.error ?? 'Error desconocido';
                bestPosition = null;
            } else {
                bestPosition = data;
                errorMessage = null;
            }
        } catch (err) {
            errorMessage = 'No se pudo obtener la mejor posición';
            bestPosition = null;
        }
    }

    // Guardar proyecto
    async function saveProject() {
        if (!bestPosition) return;

        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                latitud: $latitud,
                meses: $cavanzada.meses ?? [],
                alturaFija: $cavanzada.altura ?? null,
                acimutFijo: $cavanzada.acimut ?? null,
                altura: bestPosition.altura,
                acimut: bestPosition.acimut,
                energia: bestPosition.energia
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error ?? 'Error al guardar');
        } else {
            alert('Proyecto guardado correctamente');
        }
    }

    async function checkAuth() {
        const res = await fetch('/api/auth');
        const data = await res.json();
        isLoggedIn = !!data.userId;
    }

    onMount(() => {
        checkAuth();
        if ($latitud !== null) {
            fetchBestPosition();
        }
    });
</script>

<h2>Resultados</h2>

<div>Altura: {$cavanzada.altura ?? 'No guardada'}</div>
<div>Acimut: {$cavanzada.acimut ?? 'No guardado'}</div>
<div>Meses: {$cavanzada.meses && $cavanzada.meses.length > 0 ? $cavanzada.meses.join(', ') : 'No guardados'}</div>
<div>Latitud: {$latitud}</div>

<h3>Obstáculos:</h3>
{#if $obstacles.length > 0}
    <ul>
        {#each $obstacles as obs}
            <li>
                <strong>{obs.name}</strong> ({obs.type})<br>
                Altura: {obs.altura}<br>
                Acimut: {obs.acimutMin}° – {obs.acimutMax}°
            </li>
        {/each}
    </ul>
{:else}
    <p>No hay obstáculos guardados.</p>
{/if}

<h3>Mejor posición del panel:</h3>
{#if errorMessage}
    <p style="color: red;">{errorMessage}</p>
{:else if bestPosition}
    <div>
        Altura: {bestPosition.altura}°<br>
        Acimut: {bestPosition.acimut}°<br>
        Energía: {bestPosition.energia.toFixed(2)} kWh
    </div>
{:else}
    <p>Calculando la mejor posición...</p>
{/if}

{#if isLoggedIn && bestPosition}
    <button on:click={saveProject}>
        Guardar proyecto
    </button>
{:else if !isLoggedIn}
    <p>Inicia sesión para guardar el proyecto</p>
{/if}
