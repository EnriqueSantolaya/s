<script lang="ts">
    import { goto } from '$app/navigation';
    import { configAvanzadaStore } from '$lib/stores/configAvanzada';
    import { onMount } from 'svelte';
    import { latitudStore } from '$lib/stores/latitud';
    import TopNav from '$lib/components/TopNav.svelte';

    let altura: number | null = null;
    let acimut: number | null = null;
    let mesesInput: string = "";
    let meses: number[] | null = null;
    let initialized = false;
    let errorMessage: string | null = null;
    let lastChanged: 'altura' | 'acimut' | null = null;

    const mesesArray = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const save = () => {
        errorMessage = null;
        if (latitudStore === null) {
            errorMessage = 'Debes introducir una latitud antes de continuar.';
            return;
        }
        if (acimut !== null && altura !== null) {
            errorMessage = 'No puedes definir acimut y altura al mismo tiempo.';
            return;
        }
        next();
    };

    onMount(() => {
        const unsubscribe = configAvanzadaStore.subscribe(values => {
            altura = values.altura;
            acimut = values.acimut;
            meses = values.meses;
            if (meses && meses.length > 0) {
                 mesesInput = meses
                  .map(m => mesesArray[m - 1])
                  .join(', ');
            } else {
                mesesInput = mesesArray.join(', ');
            }

            initialized = true;
        });
        unsubscribe(); 
    });

    function next() {
      goto('/resultado');
    }

    function toggleMonth(mes: string) {
      let activos = mesesInput
        ? mesesInput.split(',').map(m => m.trim())
        : [];

      if (activos.includes(mes)) {
          // Desactivar
          activos = activos.filter(m => m !== mes);
      } else {
          // Activar
          activos.push(mes);
      }

      activos = mesesArray.filter(m => activos.includes(m));
      mesesInput = activos.join(', ');
    }

    $: if (initialized) {
      const activos = mesesInput
        ? mesesInput
          .split(',')
          .map(m => m.trim())
          .filter(Boolean)
          .map(m => mesesArray.indexOf(m) + 1)
        : [];

      configAvanzadaStore.setConfig({
        altura,
        acimut,
        meses: activos.length === 12 ? null : activos
      });
    }

    $: if (altura !== null && lastChanged === 'altura') {
      altura = Math.max(0, Math.min(90, altura));
      acimut = null;
      lastChanged = null;
  }
      $: if (acimut !== null && lastChanged === 'acimut') {
      acimut = Math.max(-180, Math.min(180, acimut));
      altura = null;
      lastChanged = null;
  }
</script>

<div class="page">
  <!-- Navegación superior -->
  <TopNav active="cavanzada" />

  <h2>Configuración Avanzada</h2>

  <div class="inputs-container">
    <!-- Input Acimut -->
    <div class="input-group">
      <div class="input-with-label">
        <div class="value-label">
          Acimut
        </div>
        <input
          type="number"
          bind:value={acimut}
          placeholder="Fijar Acimut"
          min="-180"
          max="180"
          on:input={() => lastChanged = 'acimut'}
        />
      </div>
      <div class="arrow-container">
        <svg
        width="80"
        height="80"
        viewBox="0 0 100 100"
        >
        <!-- Letra N fija -->
        <text
            x="50"
            y="10"
            text-anchor="middle"
            font-size="14"
        >
            N
        </text>
        <!-- Flecha -->
        {#if acimut !== null}
            <g style="transform: rotate({(acimut ?? 0) + 180}deg); transform-origin: 50% 50%;">
                <line x1="50" y1="80" x2="50" y2="20" stroke="black" stroke-width="4" />
                <polygon points="50,10 42,25 58,25" fill="black" />
            </g>
        {/if}
        </svg>
      </div>
    </div>

    <!-- Input Altura -->
    <div class="input-group">
      <div class="input-with-label">
        <div class="value-label">
          Altura
        </div>
      <input
          type="number"
          bind:value={altura}
          placeholder="Fijar Altura"
          min="0"
          max="90"
          on:input={() => lastChanged = 'altura'}
      />
      </div>

      <div class="altura-container">
        <svg width="120" height="80" viewBox="0 0 120 80">
        {#if altura !== null}
          <!-- Línea horizontal fija -->
          <line
            x1="10"
            y1="60"
            x2="110"
            y2="60"
            stroke="black"
            stroke-width="3"
          />

          <!-- Línea inclinada -->
          <g
          style="transform: rotate({-altura}deg); transform-origin: 10px 60px;"
          >
          <line
              x1="10"
              y1="60"
              x2="100"
              y2="60"
              stroke="black"
              stroke-width="3"
          />
          </g>
        {/if}
        </svg>
    </div>
    </div>
  </div>

  <!-- Selección de meses -->
  <p class="months-title">Seleccionar meses de actividad</p>

  <div class="months-container">
    {#each mesesArray as mes, index}
      <div
        class="month-panel"
        class:selected={mesesInput.includes(mes)}
        on:click={() => toggleMonth(mes)}
      >
        {mes}
      </div>
    {/each}
  </div>

  {#if errorMessage}
    <div class="error-message">
      {errorMessage}
    </div>
  {/if}
  <button class="bottom-button" on:click={save}>Calcular</button>

</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 40px);
    padding: 12px;
    box-sizing: border-box;

    background: linear-gradient(
      to bottom,
      #eaf7ff 0%,
      #ffffff 70%
    );

    font-family: 'Poppins', system-ui, sans-serif;
  }

  h2 {
    text-align: center;
    margin: 8px 0 20px;
    font-size: 1.3rem;
    font-weight: 600;
    color: #0f172a;
  }

  /* Contenedor de Inputs */
  .inputs-container {
    background: white;
    border-radius: 16px;
    padding: 24px;
    max-width: 600px;
    margin: 0 auto 24px;

    display: flex;
    flex-direction: column;
    gap: 24px;

    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  }

  .input-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .input-with-label {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .value-label {
    height: 18px;       
    font-size: 0.8rem;
    font-weight: 500;
    text-align: left;
    margin-left: 8px;
  }

  .input-group input {
    padding: 10px 12px;
    font-size: 0.95rem;
    border-radius: 10px;
    border: 1px solid rgba(15, 23, 42, 0.2);
    width: 160px;
  }
  .input-group input:focus {
    outline: none;
    border-color: #facc15;
  }

  .arrow-container {
    width: 100px;
    height: 100px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background: #f8fafc;
    border: 1px solid rgba(15, 23, 42, 0.15);
  }

  .arrow-container svg {
    transition: transform 0.2s ease-in-out;
  }

  .months-title {
    text-align: center;
    font-weight: 500;
    color: #0f172a;
    margin-bottom: 10px;
  }

  .months-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 600px;
    margin: 0 auto 24px;
    gap: 10px;
  }

  .month-panel {
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 0.85rem;

    border: 1px solid rgba(15, 23, 42, 0.15);
    background: white;
    cursor: pointer;

    transition: all 0.2s ease;
  }
  .month-panel:hover {
    background: #f8fafc;
  }

  .month-panel.selected {
    background: #0ea5e9;
    color: white;
    border-color: #0284c7;
  }

  .error-message {
    margin-top: 12px;
    color: #dc2626;
    font-size: 0.85rem;
    text-align: center;
  }

  .bottom-button {
    align-self: center;
    margin-top: auto;

    padding: 12px 24px;
    width: 220px;

    font-size: 1rem;
    font-weight: 600;

    background: #fde047;
    border: 1px solid #facc15;
    border-radius: 12px;

    cursor: pointer;
    transition: all 0.2s ease;
  }

  .bottom-button:hover {
    background: #facc15;
    transform: translateY(-1px);
  }
</style>
