<script lang="ts">
    import { configAvanzadaStore } from '$lib/stores/configAvanzada';
    import { latitudStore } from '$lib/stores/latitud';
    import { obstaclesStore } from '$lib/stores/obstacles';
    import { onMount } from 'svelte';
    import { elevacionPlacaStore } from '$lib/stores/elevacionPlaca';
    import { goto } from '$app/navigation';
    import AcimutDisplay from '$lib/components/AcimutDisplay.svelte';
    import AlturaDisplay from '$lib/components/AlturaDisplay.svelte';
    
    const cavanzada = configAvanzadaStore;
    const latitud = latitudStore;
    const obstacles = obstaclesStore;
    const elevacionPlaca = elevacionPlacaStore;

    let user: { id: string; username: string } | null = null;

    // Resultado de mejor posición
    let bestPosition: { altura: number; acimut: number; energia: number } | null = null;
    let errorMessage: string | null = null;
    let energiaFija: number | null = null;

    type MonthlyResult = {
        mes: number;
        energia: number;
    };
    let energiaPorMes: MonthlyResult[] = [];

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

    async function fetchEnergiaFija() {
        try {
            const response = await fetch('/api/get-old-energy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitud: $latitud,
                    meses: $cavanzada.meses ?? undefined,
                    obstacles: $obstacles
                })
            });

            const data = await response.json();
            energiaFija = data;
        } catch (e) {
            console.error('Error obteniendo energía fija', e);
            energiaFija = null;
        }
    }

    async function fetchMonthlyEnergy() {
        if (!bestPosition) return;

        try {
            const response = await fetch('/api/get-energy-each-month', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitud: $latitud,
                    altura: bestPosition.altura,
                    acimut: bestPosition.acimut,
                    meses: $cavanzada.meses ?? undefined,
                    obstacles: $obstacles
                })
            });

            const data = await response.json();
            if (response.ok) {
                energiaPorMes = data;
            }
        } catch (e) {
            console.error('Error obteniendo energía por mes', e);
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
        user = data.user ?? null;
    }

    onMount(() => {
        checkAuth();
        if ($latitud === null) {
            goto('/location');
            return;
        } else if ($cavanzada.altura !== null && $cavanzada.acimut !== null) {
            goto('/cavanzada');
            return;
        }   
        fetchBestPosition();
    });

    function maxEnergy() {
        return Math.max(...energiaPorMes.map(e => e.energia));
    }

    function barHeight(energia: number) {
        const max = maxEnergy();
        return max > 0 ? (energia / max) * 100 : 0;
    }

    $: if (bestPosition) {
        fetchEnergiaFija();
        fetchMonthlyEnergy();
    }
</script>

<div class="page">
  <!-- Navegación superior -->
  <div class="top-nav">
    <button
      type="button"
      class="nav-circle clickable"
      on:click={() => goto('/location')}
    >
      Localización
    </button>

    <button
      type="button"
      class="nav-circle clickable"
      on:click={() => goto('/obstacles')}
    >
      Obstáculos
    </button>

    <button
      type="button"
      class="nav-circle clickable"
      on:click={() => goto('/cavanzada')}
    >
      C. Avanzada
    </button>
  </div>

  <div class="results-wrapper">
    <h2>Resultados</h2>

    {#if errorMessage}
        <p style="color: red;">{errorMessage}</p>
    {:else if bestPosition}
        <div class="results-container">
            <AcimutDisplay acimut={bestPosition.acimut} />
            <AlturaDisplay altura={bestPosition.altura} />

            {#if energiaFija !== null}
                <p>
                    Energía mejor posición: {Math.round(bestPosition.energia / 1000)}W/m2 | 
                    Energía posición método clásico: {Math.round(energiaFija / 1000)}W/m2
                </p>
            {/if}

            {#if energiaPorMes.length > 0}
                <div class="horizontal-table">
                    {#each energiaPorMes as item}
                        <div class="month-column">
                            <div class="month-name">
                                {item.mes}
                            </div>

                            <div class="bar-wrapper">
                                <div
                                    class="energy-bar"
                                    style="height: {barHeight(item.energia)}%"
                                />
                            </div>

                            <div class="energy-label">
                                {Math.round(item.energia / 1000)}k
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}

        </div>
    {:else}
        <p>Calculando la mejor posición...</p>
    {/if}

    {#if user && bestPosition}
        <p>Logeado como <strong>{user.username}</strong></p>
        <button on:click={saveProject} class="save-button">Guardar proyecto</button>
    {:else if !user}
        <p>Inicia sesión para guardar el proyecto</p>
    {/if}
  </div>
</div>

<style>
    .page {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 40px);
    padding: 6px;
    box-sizing: border-box;
  }
  /* Navegación superior */
  .top-nav {  
    display: flex;
    justify-content: center;
    gap: 60px;
  }

  .nav-circle {
    width: 80px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid black;

    display: flex;
    align-items: center;
    justify-content: center;

    text-align: center;
    font-size: 14px;
    line-height: 1.2;

    user-select: none;
  }

  /* Círculos clicables */
  .nav-circle.clickable {
    cursor: pointer;
  }

  button.nav-circle {
    background: none;
    padding: 0;
    margin: 0;
    outline: none;
    border: 1px solid black;

    width: 80px;
    height: 60px;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-family: inherit;
    font-size: 14px;
    line-height: 1.2;
    color: inherit;
  }

  .results-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center; 
    text-align: center;
  }

  .results-container {
    display: flex;
    flex-direction: column;
    gap: 25px;
    align-items: center;
    margin-top: 20px;
  }

  .horizontal-table {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 14px;
    margin-top: 35px;
    padding: 10px 0;
  }

  .month-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40px;
    font-size: 13px;
  }

  .month-name {
    margin-bottom: 6px;
    font-weight: 500;
  }

  .bar-wrapper {
    height: 120px;
    width: 18px;
    background: #f1f1f1;
    border: 1px solid #bbb;
    display: flex;
    align-items: flex-end;
  }

  .energy-bar {
    width: 100%;
    background: linear-gradient(
        to top,
        #4caf50,
        #81c784
    );
  }

  .energy-label {
    margin-top: 6px;
    font-size: 12px;
    color: #333;
  }

  .save-button {
    margin-top: 10px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
  }
</style>