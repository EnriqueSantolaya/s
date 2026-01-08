<script lang="ts">
    import { goto } from '$app/navigation';
    import { configAvanzadaStore } from '$lib/stores/configAvanzada';
    import { onMount } from 'svelte';
    import { latitudStore } from '$lib/stores/latitud';

    let altura: number | null = null;
    let acimut: number | null = null;
    let mesesInput: string = "";
    let meses: number[] | null = null;
    let initialized = false;
    let errorMessage: string | null = null;

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
                mesesInput = mesesArray
                    .filter((_, index) => !meses!.includes(index + 1)) // Excluimos los meses seleccionados
                    .join(', '); // Unimos los meses no seleccionados en una cadena
            } else {
                mesesInput = ''; // Si no hay meses guardados, iniciamos con cadena vacía
            }

            initialized = true;
        });
        unsubscribe(); 
    });

    function next() {
        goto('/resultado');
    }

    function toggleMonth(mes: string) {
        const mesNumber = mesesArray.indexOf(mes) + 1;

        // Si el mes está seleccionado, lo deseleccionamos
        if (mesesInput.includes(mes)) {
            mesesInput = mesesInput
                .split(',')
                .map(m => m.trim())  // Separar por coma
                .filter(m => m !== mes)  // Filtrar el mes
                .join(',');  // Unir de nuevo
        } else {
            // Si no está seleccionado, lo agregamos
            mesesInput = mesesInput
                ? `${mesesInput}, ${mes}`  // Si ya hay meses, añadir el nuevo
                : mes;  // Si no, solo asignamos el mes
        }
    }

    $: if (initialized) {
        // Convertimos mesesInput → meses
        const mesesCalculados = mesesInput
            ? mesesArray
                .filter(m => !mesesInput.includes(m))
                .map(m => mesesArray.indexOf(m) + 1)
            : null;

        configAvanzadaStore.setConfig({
            altura,
            acimut,
            meses: mesesCalculados
        });
    }

    $: if (acimut !== null) {
        acimut = Math.max(-180, Math.min(180, acimut));
    }
    $: if (altura !== null) {
        altura = Math.max(0, Math.min(90, altura));
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

    <div class="nav-circle active">
      C. Avanzada
    </div>
  </div>

  <h2>Configuración Avanzada</h2>

  <div class="inputs-container">
    <!-- Input Acimut -->
    <div class="input-group">
      <input
        type="number"
        bind:value={acimut}
        placeholder="Fijar Acimut"
        min="-180"
        max="180"
      />
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
      <input
          type="number"
          bind:value={altura}
          placeholder="Fijar Altura"
          min="0"
          max="90"
      />

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
  <p class="months-title">Seleccionar meses de inactividad</p>

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
    padding: 6px;
    box-sizing: border-box;
  }

  /* Navegación superior */
  .top-nav {
    display: flex;
    justify-content: center;
    gap: 60px;
  }

  /* Estilo de los botones de navegación superior */
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

  .nav-circle.clickable {
    cursor: pointer;
  }

  .nav-circle.active {
    cursor: default;
    font-weight: bold;
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

  button.nav-circle:focus {
    outline: none;
  }

  h2 {
    text-align: center;
    margin-bottom: 20px;  
    }

  /* Contenedor de Inputs */
  .inputs-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
  }

  .input-group {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .input-group input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 150px;
  }

  .arrow-container {
    width: 100px;
    height: 100px;
    margin-left: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid #ccc;
  }

  .arrow-container svg {
    transition: transform 0.2s ease-in-out;
  }

  .months-title {
    margin-top: 25px;
    margin-bottom: 10px;
    font-weight: 500;
    text-align: center;
    color: #333;
}

  .months-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 30px;
  }

  .month-panel {
    padding: 10px 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    cursor: pointer;
    text-align: center;
  }

  .month-panel.selected {
    background-color: #b0b0b0;
    color: white;
  }

  .error-message {
    margin-top: 15px;
    color: #b00020;
    font-weight: 500;
    text-align: center;
 }

  .bottom-button {
    margin-top: 30px;
    padding: 10px 20px;
    width: 200px;
    font-size: 16px;
    align-self: center;
    background-color: #d3d3d3;
    color: #333;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .bottom-button:hover {
    background-color: #b0b0b0;
  }
</style>
