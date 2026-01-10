<script lang="ts">
  import { goto } from '$app/navigation';
  import { obstaclesStore } from '$lib/stores/obstacles';
  import { elevacionPlacaStore } from '$lib/stores/elevacionPlaca';
  import type { Obstacle } from '$lib/obstacles';
  import { onMount } from 'svelte';

  let newNombre = '';
  let newType: 'tree' | 'mountain' | 'building' | 'wall' | 'custom' = 'wall'; // Tipo de obstáculo
  let distancia = 0; // distancia al obstáculo
  let alturaFisica = 0; // altura real del obstáculo
  let acimutCentro = 0; // acimut central
  let anchoFactor = 1; // factor de anchura
  let showAddPanel = false; // Mostrar/ocultar panel de añadir obstáculo
  let selectedIndex: number | null = null; // Índice del obstáculo seleccionado para editar
  let isEditing = false; // Modo edición activado/desactivado
  let circleWrapper: HTMLDivElement;
  let bigCircle: HTMLDivElement;
  const R = 125; // radio del disco grande (px)
  const factor = 1; // escala de distancia
  let draggingIndex: number | null = null;
  let dragPositions: { x: number; y: number }[] = [];
  let originalDistancia = 0; // Variables para almacenar los valores originales al iniciar el drag
  let originalAcimut = 0; // Variables para almacenar los valores originales al iniciar el drag

  function getVisualPosition(distancia: number, acimut: number) {
    const d = Math.min(distancia * factor, R);

    return {
      x: Math.round(R + Math.sin(acimut * Math.PI / 180) * d),
      y: Math.round(R + Math.cos(acimut * Math.PI / 180) * d)
    };
  }

  function selectObstacleFromCircle(obs: Obstacle, index: number | null) {
    if (selectedIndex !== index) {
      selectedIndex = index;
      isEditing = true;
      showAddPanel = true;

      originalDistancia = obs.distancia;
      originalAcimut = obs.acimutCentro;

      // Rellenar formulario con los valores actuales del store
      newNombre = obs.name;
      newType = obs.type;
      distancia = obs.distancia;
      alturaFisica = obs.alturaFisica;
      acimutCentro = obs.acimutCentro;
      anchoFactor = obs.anchoFactor;
    }
  }

  function startDrag(index: number, event: MouseEvent) {
    event.preventDefault();
    if (selectedIndex !== null && selectedIndex !== index) {
      restoreOriginalPosition();
    }
    selectObstacleFromCircle($obstaclesStore[index], index);
    draggingIndex = index;
  }

  function restoreOriginalPosition() {
    if (selectedIndex === null) return;

    const d = Math.min(originalDistancia * factor, R);

    dragPositions[selectedIndex] = {
      x: Math.round(R + Math.sin(originalAcimut * Math.PI / 180) * d),
      y: Math.round(R + Math.cos(originalAcimut * Math.PI / 180) * d)
    };
  }

  function onMouseMove(event: MouseEvent) {
    if (draggingIndex === null) return;

    const rect = bigCircle.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // calcular desplazamiento desde el centro
    let dx = event.clientX - rect.left - cx;
    let dy = event.clientY - rect.top - cy;

    // limitar al radio del círculo
    const distanciaTemp = Math.sqrt(dx*dx + dy*dy);
    const maxDist = R;
    if (distanciaTemp > maxDist) {
      const scale = maxDist / distanciaTemp;
      dx *= scale;
      dy *= scale;
    }

    // actualizar posición del obstáculo en el dibujo, redondeando a 2 decimales
    dragPositions[draggingIndex] = {
      x: Math.round(cx + dx),
      y: Math.round(cy + dy)
    };

    // actualizar inputs del panel si es el seleccionado
    if (draggingIndex === selectedIndex) {
      distancia = Math.round(Math.sqrt(dx*dx + dy*dy) / factor);
      acimutCentro = Math.round(Math.atan2(dx, dy) * 180 / Math.PI);
    }
  }

  function endDrag() {
    draggingIndex = null;
  }

  function updateDragPositionFromInputs() {
    if (selectedIndex === null) return;
    const d = Math.min(distancia * factor, R);

    const dx = Math.sin(acimutCentro * Math.PI / 180) * d;
    const dy = Math.cos(acimutCentro * Math.PI / 180) * d;

    dragPositions[selectedIndex] = {
      x: Math.round(R + dx),
      y: Math.round(R + dy)
    };
  }

  function addObstacle() {
    const nombreFinal = newNombre.trim() || 'Nuevo Obstáculo';
    if (distancia <= 0 || alturaFisica <= 0 || acimutCentro < -180 || acimutCentro > 180) return;

    const updatedObstacle: Obstacle = {
      name: nombreFinal,
      type: newType,
      alturaFisica,
      distancia,
      acimutCentro,
      anchoFactor
    };

    obstaclesStore.update(obs => {
      if (isEditing && selectedIndex !== null) {
        return obs.map((o, i) =>
          i === selectedIndex ? updatedObstacle : o
        );
      }
      return [...obs, updatedObstacle];
    });

    showAddPanel = false;
    selectedIndex = null;
    isEditing = false;
  }

  function editObstacle(obs: Obstacle, index: number) {
    selectedIndex = index;
    isEditing = true;
    showAddPanel = true;

    originalDistancia = obs.distancia;
    originalAcimut = obs.acimutCentro;

    newNombre = obs.name;
    newType = obs.type;
    distancia = obs.distancia;
    alturaFisica = obs.alturaFisica;
    acimutCentro = obs.acimutCentro;
    anchoFactor = obs.anchoFactor;
  }

  function removeObstacle(index: number) {
    obstaclesStore.update(obs => obs.filter((_, i) => i !== index));
  }

  onMount(() => {
    dragPositions = $obstaclesStore.map(obs => {
      const d = Math.min(obs.distancia * factor, R); 

      return {  
        x: Math.round(R + Math.sin(obs.acimutCentro * Math.PI / 180) * d),
        y: Math.round(R + Math.cos(obs.acimutCentro * Math.PI / 180) * d)
      };
    });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', endDrag);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', endDrag);
    };
  });
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

    <div class="nav-circle active">
      Obstáculos
    </div>

    <button
      type="button"
      class="nav-circle clickable"
      on:click={() => goto('/cavanzada')}
    >
      C. Avanzada
    </button>
  </div>

  <!-- Círculo superior -->
  <div class="top-center">
    <div class="circle-wrapper" bind:this={circleWrapper}>
      <div class="big-circle" bind:this={bigCircle}>
        <span class="direction n">N</span>
        <span class="direction s">S</span>
        <span class="direction e">E</span>
        <span class="direction o">O</span>

        <div class="center-dot"></div>

        {#each $obstaclesStore as obs, index}
          <div class="obstacle {obs.type}"
            style="left: {dragPositions[index]?.x ?? getVisualPosition(obs.distancia, obs.acimutCentro).x}px;
                    top: {dragPositions[index]?.y ?? getVisualPosition(obs.distancia, obs.acimutCentro).y}px;
                    transform: translate(-50%, -50%);"
            title={obs.name}
            on:click={() => selectObstacleFromCircle(obs, index)}
            on:mousedown={(e) => startDrag(index, e)}>
            <!-- Representación visual del tipo -->
            {#if obs.type === 'tree'}
                🌲
            {:else if obs.type === 'mountain'}
                🏔️
            {:else if obs.type === 'building'}
                🏢
            {:else if obs.type === 'wall'}
                🧱
            {:else}
                ⚪
            {/if}
        </div>
        {/each}
      </div>

      

      <div class="elevation-input">
        <label>Elevación placa</label>
        <input
          type="number"
          min="0"
          bind:value={$elevacionPlacaStore}
        />
      </div>
    </div>
  </div>

  <!-- Zona principal -->
  <div class="main">

    <!-- Lista de obstáculos -->
    <div class="list-panel">
      <div class="list-container">
        <div class="list-header">
          <h2>Obstáculos</h2>
          <button
            class="add-btn"
            on:click={() => {
              isEditing = false;
              selectedIndex = null;
              showAddPanel = true;

              newNombre = '';
              newType = 'wall';
              distancia = 0;
              alturaFisica = 0;
              acimutCentro = 0;
              anchoFactor = 1;
            }}
          >
            +
          </button>
        </div>

        <ul class="obstacles-list">
          {#each $obstaclesStore as obs, index}
            <li class="obstacle-item">
              <button
                type="button"
                class="obstacle-button"
                on:click={() => editObstacle(obs, index)}
              >
                <span>{obs.name} ({obs.type})</span>
              </button>

              <button
                type="button"
                class="delete-btn"
                on:click={() => removeObstacle(index)}
              >
                ✕
              </button>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <!-- Panel lateral -->
  {#if showAddPanel}
    <div class="side-panel">

      <!-- X arriba derecha -->
      <div class="panel-header">
        <button class="close-btn" on:click={() => {
          restoreOriginalPosition();
          showAddPanel = false;
          selectedIndex = null;
          isEditing = false;
        }}>
          ✕
        </button>
      </div>

      <!-- Nombre editable como título -->
      <input
        type="text"
        class="title-input"
        placeholder="Nuevo obstáculo..."
        bind:value={newNombre}
      />

      <!-- Acimut central -->
      <div class="field">
        <label>Acimut central</label>
        <input 
          type="number" 
            min="-180" 
            max="180" 
            step="1" 
            placeholder="Acimut central" 
            bind:value={acimutCentro} 
            on:input={updateDragPositionFromInputs}
        />
      </div>

      <!-- Distancia -->
      <div class="field">
        <label>Distancia</label>
        <input type="number" min="0" placeholder="Distancia" bind:value={distancia} on:input={updateDragPositionFromInputs} />
      </div>

      <!-- Altura física -->
      <div class="field">
        <label>Altura física</label>
        <input type="number" min="0" placeholder="Altura física" bind:value={alturaFisica} />
      </div>

      <!-- Forma -->
      <div class="field">
        <label>Tipo de obstáculo</label>
        <select bind:value={newType}>
          <option value="tree">🌲 Árbol</option>
          <option value="mountain">⛰️ Montaña</option>
          <option value="building">🏢 Edificio</option>
          <option value="wall">🧱 Muro</option>
          <option value="custom">❓ Otro</option>
        </select>
      </div>

      <!-- Factor de anchura -->
      <div class="field">
        <label>Factor anchura: {anchoFactor.toFixed(2)}</label>
      </div>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.01"
          bind:value={anchoFactor}
          class="slider"
          style="--value: {(anchoFactor-0.1)/2.9*100}%"
        />

      <!-- Botón guardar centrado -->
      <div class="panel-actions">
        <button class="save-btn" on:click={addObstacle}>Guardar</button>
      </div>

    </div>
  {/if}

</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 40px);
    flex: 1;
    padding: 12px;
    box-sizing: border-box;

    background: linear-gradient(
      to bottom,
      #eaf7ff 0%,
      #ffffff 70%
    );

    font-family: 'Poppins', system-ui, sans-serif;
  }

  /* Navegación superior */
  .top-nav {  
    display: flex;
    justify-content: center;
    gap: 60px;
    margin-bottom: 16px;
  }

  .nav-circle {
    width: 90px;
    height: 64px;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 13px;
    line-height: 1.2;
    user-select: none;

    background: white;
    border: 1px solid rgba(15, 23, 42, 0.15);
    color: #0f172a;

    transition: all 0.2s ease;
  }

  /* Círculos clicables */
  .nav-circle.clickable {
    cursor: pointer;
  }
  .nav-circle.clickable:hover {
    background: #f8fafc;
    transform: translateY(-2px);
  }

  /* Círculo actual (no clicable) */
  .nav-circle.active {
    font-weight: 600;
    background: #fde047;
    border-color: #facc15;
    box-shadow: 0 4px 10px rgba(250, 204, 21, 0.4);
    cursor: default;
  }

  /* Círculo obstáculos */
  .top-center {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
  }

  .circle-wrapper {
    position: relative;
    z-index: 1;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    background: white;
    padding: 16px;
    border-radius: 20px;

    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  }

  .big-circle {
    position: relative; 
    width: 250px;
    height: 250px;
    border-radius: 50%;

    background: radial-gradient(circle at center, #f8fafc, #ffffff);
    border: 1px solid rgba(15, 23, 42, 0.15);
    z-index: 2;
  }

  .direction {
    position: absolute;
    font-size: 12px;
    font-weight: 500;
    color: rgba(15, 23, 42, 0.7);
    user-select: none;
  }

  .direction.n {
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
  }

  .direction.s {
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
  }

  .direction.e {
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
  }

  .direction.o {
    left: 6px;
    top: 50%;
    transform: translateY(-50%);
  }

  .center-dot {
    position: absolute;
    top: 50%;
    left: 50%;

    width: 12px;
    height: 12px;
    border-radius: 50%;

    background: #0f172a;

    transform: translate(-50%, -50%);
  }

  .obstacle {
    position: absolute;
    cursor: grab;
    user-select: none;
  }
  
  .obstacle:active {
    cursor: grabbing;
  }

  .obstacle-item {
    display: flex;
    align-items: center;
    gap: 8px;

    border: 1px solid rgba(15, 23, 42, 0.1);
    border-radius: 10px;

    padding: 6px 10px;
    margin-bottom: 8px;

    transition: background-color 0.2s ease;
  }

  .obstacle-item:hover {
    background: #f8fafc;
  }

  .obstacle.rectangle {
    width: 20px;
    height: 20px;
    background-color: red;
    border-radius: 2px;
  }

  .obstacle.triangle {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid blue;
  }

  .elevation-input {
    position: absolute;
    top: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);

    background: white;
    border: 1px solid rgba(15, 23, 42, 0.15);
    padding: 8px 10px;
    border-radius: 10px;

    font-size: 12px;
    text-align: center;

    z-index: 20; 
    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.15);
  }

  .elevation-input input {
    width: 90px;
    padding: 6px;
    border-radius: 6px;
    border: 1px solid rgba(15, 23, 42, 0.2);
  }

  /* Zona principal */
  .main {
    flex: 1;
    display: flex;
    gap: 16px;
  }

  /* Lista */
  .list-panel {
    flex: 1;
    display: flex;
    justify-content: center;
    border: none;
  }

  .list-container {
    width: 100%;
    max-width: 600px;

    background: white;
    border-radius: 16px;
    padding: 16px;

    box-shadow:
      0 10px 30px rgba(15, 23, 42, 0.12);

    display: flex;
    flex-direction: column;
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .list-header h2 {
    margin: 0;
    font-size: 1.1rem;
  }

  .obstacles-list {
    list-style: none;
    padding: 0;
    margin: 1px 0 0 0;

    overflow-y: auto;
    max-height: 280px;
  }

  .obstacle-item {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid black;
    padding: 0; 
    margin-bottom: 8px;
    border-radius: 6px;
    padding: 4px 8px; 
    margin-bottom: 8px;
    transition: background-color 0.2s ease;
  }

  .obstacle-item:hover {
    background-color: #f5f5f5;
  }

  .obstacle-button {
    flex: 1;
    background: none;
    border: none;
    padding: 8px 12px;
    text-align: left;
    cursor: pointer;
    font: inherit;
  }

  .delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    padding: 4px 6px;
  }

  .add-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: #fde047;
    font-size: 18px;
    cursor: pointer;
  }
  .add-btn:hover {
    background: #facc15;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
  }

  /* Panel lateral */
  .side-panel {
    position: absolute;
    top: 0;
    right: 0;
    height: calc(100vh - 40px);
    width: 350px;

    background: white;
    border-left: 1px solid rgba(15, 23, 42, 0.15);

    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    box-shadow:
      -10px 0 30px rgba(15, 23, 42, 0.15);
  }

  .panel-header {
    display: flex;
    justify-content: flex-end;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    line-height: 1;
    padding: 0;
  }

  .title-input {
    font-size: 20px;
    font-weight: bold;
    border: none;
    outline: none;
    width: 100%;
    text-align: left;
    padding: 4px 0;
  }

  .title-input::placeholder {
    color: #888;
    font-weight: bold;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .field label {
    font-weight: bold;
    font-size: 14px;
  }

  .field input,
  .field select {
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid rgba(15, 23, 42, 0.2);
  }

  /* Slider factor anchura */
  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 4px; 
    border-radius: 2px;
    background: #ddd; 
    outline: none;
    position: relative;
  }

  .slider::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: var(--value); 
    background: #2196F3;
    border-radius: 2px;
    pointer-events: none; 
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #2196F3;
    cursor: pointer;
    border: 2px solid #333;
    position: relative;
    z-index: 1; 
  }

  .slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #2196F3;
    cursor: pointer;
    border: 2px solid #333;
    position: relative;
    z-index: 1;
  }

  .panel-actions {
    margin-top: auto;
    display: flex;
    justify-content: center;
  }

  .save-btn {
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    border: none;
    border-radius: 10px;

    background: #fde047;
    color: #0f172a;
    font-weight: 600;
  }

  .save-btn:hover {
    background: #facc15;
  }

  /* Reset visual del botón para que parezca un div */
  button.nav-circle {
    background: none;
    padding: 0;
    margin: 0;
    outline: none;
  }

  /* Evita estilos raros al hacer focus/click */
  button.nav-circle:focus {
    outline: none;
  }

  /* Mantiene tipografía consistente */
  button.nav-circle {
    font-family: inherit;
    color: inherit;
  }
</style>
