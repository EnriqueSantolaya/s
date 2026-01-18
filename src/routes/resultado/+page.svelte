<script lang="ts">
    import { configAvanzadaStore } from '$lib/stores/configAvanzada';
    import { latitudStore } from '$lib/stores/latitud';
    import { longitudStore } from '$lib/stores/longitud';
    import { obstaclesStore } from '$lib/stores/obstacles';
    import { onMount } from 'svelte';
    import { elevacionPlacaStore } from '$lib/stores/elevacionPlaca';
    import { goto } from '$app/navigation';
    import TopNav from '$lib/components/TopNav.svelte';
    import AcimutDisplay from '$lib/components/AcimutDisplay.svelte';
    import AlturaDisplay from '$lib/components/AlturaDisplay.svelte';
    
    const cavanzada = configAvanzadaStore;
    const latitud = latitudStore;
    const longitud = longitudStore;
    const obstacles = obstaclesStore;
    const elevacionPlaca = elevacionPlacaStore;

    let user: { id: string; username: string } | null = null;
    let projectName = '';

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
                    altura: $cavanzada.altura ?? undefined,
                    acimut: $cavanzada.acimut ?? undefined,
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
                name: projectName,
                latitud: $latitud,
                longitud: $longitud,
                meses: $cavanzada.meses ?? [],
                alturaFija: $cavanzada.altura ?? null,
                acimutFijo: $cavanzada.acimut ?? null,
                altura: bestPosition.altura,
                acimut: bestPosition.acimut,
                energia: bestPosition.energia,
                obstacles: $obstacles
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error ?? 'Error al guardar');
        } else {
            goto('/proyectos');
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
  <TopNav active="resultado" />

  <div class="results-wrapper">
    <h2>Resultados</h2>

    {#if errorMessage}
        <p style="color: red;">{errorMessage}</p>
    {:else if bestPosition}
        <div class="results-container">
            <h3 class="section-title">Posición óptima</h3>
            <AcimutDisplay acimut={bestPosition.acimut} />
            <AlturaDisplay altura={bestPosition.altura} />

            {#if energiaFija !== null}
                <h3 class="section-title">Comparación de métodos</h3>

                <div class="comparison-cards">
                    <div class="comparison-card best">
                        <span class="card-title">Mejor posición</span>
                        <span class="card-value">
                        {Math.round(bestPosition.energia / 1000)} kWh/m²
                        </span>
                    </div>

                    <div class="comparison-card classic">
                        <span class="card-title">Método clásico</span>
                        <span class="card-value">
                        {Math.round(energiaFija / 1000)} kWh/m²
                        </span>
                    </div>

                    <div class="comparison-card difference">
                        <span class="card-title">Diferencia</span>
                        <span class="card-value positive">
                        +{Math.round((bestPosition.energia - energiaFija) / 1000)} kWh/m²
                        </span>
                    </div>
                </div>
            {/if}

            {#if energiaPorMes.length > 0}
                <h3 class="section-title">Energía diaria por mes</h3>

                <div class="horizontal-table">
                    {#each energiaPorMes as item}
                        <div class="month-column">
                            <div class="month-name">
                                {new Date(0, item.mes-1).toLocaleString('es-ES', { month: 'short' })}
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
        <div class="save-project-card">
            <input
                type="text"
                placeholder="Nombre del proyecto"
                bind:value={projectName}
                class="project-name-input"
            />

            <button on:click={saveProject} class="save-button">
                Guardar proyecto
            </button>
        </div>
    {:else if !user}
        <p>Inicia sesión para guardar el proyecto</p>
    {/if}
  </div>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 40px);
    padding: 12px;
    box-sizing: border-box;
    background: linear-gradient(to bottom, #eaf7ff 0%, #ffffff 70%);
    font-family: 'Poppins', system-ui, sans-serif;
  }

  /* Contenedor principal de resultados */
  .results-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
  }
  .results-wrapper h2 {
    margin: 0;
    margin-bottom: 3px;
    font-size: 1.5rem;
    color: #0f172a;
    font-weight: 600;
  }

  .results-container {
    background: white;
    border-radius: 16px;
    padding: 24px;
    max-width: clamp(280px, 95%, 600px);
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    box-sizing: border-box;
  } 

  .save-project-card {
    margin-top: 24px;
    background: white;
    border-radius: 16px;
    padding: 20px 18px 24px;
    max-width: clamp(280px, 95%, 400px);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    border: 1px solid rgba(15, 23, 42, 0.12);
  }

  .section-title {
    font-size: 1.1rem;
    font-weight: 500;
    color: #0f172a;
    margin-bottom: 2px;
    margin-top: 6px;
  }

  /* Comparación de energía */
  .comparison-cards {
    display: flex;
    gap: 16px;
    justify-content: center;
    width: clamp(280px, 90%, 600px);
    
  }

  .comparison-card {
    flex: 1;
    background: white;
    border-radius: 14px;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.1);
    border: 1px solid rgba(15, 23, 42, 0.12);
  }

  .card-title {
    font-size: 0.85rem;
    font-weight: 500;
    color: #475569;
    margin-bottom: 6px;
  }

  .card-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: #0f172a;
  }

  /* Variantes visuales */
  .comparison-card.best {
    background: linear-gradient(to bottom, #fef9c3, #ffffff);
    border-color: #fde047;
  }

  .comparison-card.classic {
    background: linear-gradient(to bottom, #f1f5f9, #ffffff);
  }

  .comparison-card.difference {
    background: linear-gradient(to bottom, #dcfce7, #ffffff);
    border-color: #86efac;
  }

  .card-value.positive {
    color: #166534;
  }

  .horizontal-table {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    max-width: clamp(280px, 95%, 600px);
    gap: 12px;
  }

  .month-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30px;
    font-size: 13px;
  }

  .month-name {
    margin-bottom: 6px;
    font-weight: 500;
    color: #0f172a;
  }

  .bar-wrapper {
    height: 120px;
    width: 14px;
    background: #f1f1f1;
    border: 1px solid #bbb;
    border-radius: 8px;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }

  .energy-bar {
    width: 100%;
    background: linear-gradient(to top, #fde047, #fef08a);
    transition: height 0.6s ease-out;
    border-radius: 6px 6px 0 0;
  }

  .energy-label {
    margin-top: 6px;
    font-size: 12px;
    color: #0f172a;
  }

  .project-name-input {
    margin-top: 12px;
    padding: 10px 14px;
    width: 260px;
    border-radius: 10px;
    border: 1px solid rgba(15, 23, 42, 0.2);
    font-size: 0.95rem;
    text-align: center;
  }

  .project-name-input:focus {
    outline: none;
    border-color: #facc15;
  }

  .save-button {
    margin-top: 22px;
    margin-bottom: 12px;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 600;
    background: #fde047;
    border: 1px solid #facc15;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  } 

  .save-button:hover {
    background: #facc15;
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    .horizontal-table {
        gap: 4px;
    }
  }
</style>