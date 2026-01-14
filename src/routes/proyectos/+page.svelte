<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { latitudStore } from '$lib/stores/latitud';
  import { longitudStore } from '$lib/stores/longitud';
  import { configAvanzadaStore } from '$lib/stores/configAvanzada';
  import { obstaclesStore } from '$lib/stores/obstacles';

  let projects: any[] = [];
  let error: string | null = null;

  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects');
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

  function loadProject(p: any) {
    latitudStore.set(p.latitud);
    longitudStore.set(p.longitud);

    configAvanzadaStore.setConfig({
      altura: p.alturaFija ?? null,
      acimut: p.acimutFijo ?? null,
      meses: p.meses && p.meses.length > 0 ? p.meses : null
    });

    obstaclesStore.set(p.obstacles ?? []);

    goto('/cavanzada');
  }

  async function deleteProject(id: string) {
    const confirmed = confirm('¿Seguro que quieres borrar este proyecto?');
    if (!confirmed) return;

    const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
    });

    if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? 'Error al borrar el proyecto');
        return;
    }

    projects = projects.filter(p => p.id !== id);
  }

  onMount(() => {
    fetchProjects();
  });

  function goBack() {
    history.back();
  }
</script>

<div class="projects-page-wrapper">
  <div class="projects-page">
    <!-- Botón cerrar -->
    <button class="close-btn" on:click={goBack}>×</button>

    <h2>Lista de proyectos</h2>

    {#if error}
      <p class="error">{error}</p>
    {:else if projects.length === 0}
      <p>No hay proyectos guardados.</p>
    {:else}
      <ul class="project-list">
        {#each projects as p}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <li class="project-item" on:click={() => loadProject(p)}>
            <div class="project-header">
              <strong>{p.name}</strong>

              <button
                class="delete-btn"
                on:click|stopPropagation={() => deleteProject(p.id)}
                title="Eliminar proyecto"
              >
                ×
              </button>
            </div>

            <span>Acimut: <strong>{p.acimut ?? 'N/A'}°</strong></span><br>
            <span>Altura: <strong>{p.altura ?? 'N/A'}°</strong></span><br>
            <span>Energía: <strong>{p.energia ? Math.round(p.energia / 1000) + ' W/m²' : 'N/A'}</strong></span><br>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  /* Fondo de toda la página */
  .projects-page-wrapper {
    background: linear-gradient(
      to bottom,
      #eaf7ff 0%,
      #ffffff 70%
    ); 
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px 0;
  }

  /* Contenedor del "cuadro blanco" */
  .projects-page {
    position: relative;
    width: 100%;
    max-width: 700px;
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);

    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .close-btn {
    position: absolute;
    top: 14px;
    right: 14px;
    font-size: 24px;
    background: rgba(15, 23, 42, 0.05);
    border: none;
    border-radius: 8px;
    width: 36px;
    height: 36px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }
  .close-btn:hover {
    background: rgba(15, 23, 42, 0.1);
    transform: scale(1.1);
  }

  h2 {
    text-align: center;
    margin-bottom: 10px;
    color: #0f172a;
  }

  .project-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .project-item {
    padding: 16px;
    border-radius: 12px;
    border: 1px solid rgba(15, 23, 42, 0.15);
    cursor: pointer;
    background: white;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  }
  .project-item:hover {
    background: #f8fafc;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

  .delete-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 24px;
    opacity: 0.6;
    transition: opacity 0.2s, transform 0.1s;
  }

  .delete-btn:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  .error {
    color: #dc2626;
    text-align: center;
    margin-bottom: 16px;
  }
</style>
