<script lang="ts">
  import { goto } from '$app/navigation';
  import { obstaclesStore } from '$lib/stores/obstacles';
  import type { Obstacle } from '$lib/obstacles';

  let newNombre = '';

  function addObstacle() {
    if (!newNombre.trim()) return;

    // Por simplicidad, agregamos un Rectangle con valores por defecto
    const newObstacle: Obstacle = {
      name: newNombre,
      type: 'rectangle',
      acimutMin: 0,
      acimutMax: 0,
      altura: 0
    };

    obstaclesStore.update(obs => [...obs, newObstacle]);
    newNombre = '';
  }

  function removeObstacle(index: number) {
    obstaclesStore.update(obs => obs.filter((_, i) => i !== index));
  }

  function next() {
    goto('/cavanzada');
  }
</script>

<h2>Lista de Obstáculos</h2>
<ul>
  {#each $obstaclesStore as obs, index}
    <li>
      {obs.name}
      <button on:click={() => removeObstacle(index)}>Eliminar</button>
    </li>
  {/each}
</ul>

<div>
  <input type="text" placeholder="Nombre del obstáculo" bind:value={newNombre} />
  <button on:click={addObstacle}>Agregar</button>
  <button on:click={next}>C. Avanzada</button>
</div>