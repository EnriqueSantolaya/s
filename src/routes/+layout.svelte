<script lang="ts">
  import { navigating } from '$app/state';

  let mostrar = false;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  $: {
    if (navigating) {
      timeout = setTimeout(() => {
      mostrar = true;
      }, 300);
    } else {
      mostrar = false;
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    }
  }
</script>

{#if mostrar}
  <div class="loader">
    Cargando…
  </div>
{/if}

<slot />

<style>
  .loader {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.85);
    color: white;
    display: grid;
    place-items: center;
    z-index: 9999;
    font-size: 1.5rem;
  }
</style>