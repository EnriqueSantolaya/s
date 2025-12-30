<script lang="ts">
  import { goto } from '$app/navigation';
  import { latitudStore } from '$lib/stores/latitud';
  import { get } from 'svelte/store';

  let latitud: number | null = get(latitudStore);

  function saveLatitud() {
    if (latitud !== null) latitudStore.set(latitud);
    goto('/obstacles');
  }
</script>

<main>
  <h2>Pantalla Location</h2>
  <input type="number" bind:value={latitud} placeholder="Introduce tu latitud" />
  <button on:click={saveLatitud}>Obstáculos</button>
</main>