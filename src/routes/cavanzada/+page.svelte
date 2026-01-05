<script lang="ts">
    import { goto } from '$app/navigation';
    import { configAvanzadaStore } from '$lib/stores/configAvanzada';
    import { onMount } from 'svelte';

    let altura: number | null = null;
    let acimut: number | null = null;
    let mesesInput: string = "";
    let meses: number[] | null = null;

    const save = () => {
        meses = mesesInput
            ? mesesInput.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n))
            : null;

        configAvanzadaStore.setConfig({ altura, acimut, meses });
        next();
    };

    onMount(() => {
        const unsubscribe = configAvanzadaStore.subscribe(values => {
            altura = values.altura;
            acimut = values.acimut;
            meses = values.meses;
            mesesInput = values.meses ? values.meses.join(',') : '';
        });
        unsubscribe(); 
    });

    function next() {
        goto('/resultado');
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

  <input type="number" bind:value={altura} placeholder="Altura" />
  <input type="number" bind:value={acimut} placeholder="Acimut" />
  <input type="text" bind:value={mesesInput} placeholder="Meses (1,2,3...)" />

  <button on:click={save}>Calcular</button>
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

  /* Círculo actual (no clicable) */
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

  /* Evita estilos raros al hacer focus/click */
  button.nav-circle:focus {
    outline: none;
  }
</style>