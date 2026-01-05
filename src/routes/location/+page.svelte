<script lang="ts">
  import { goto } from '$app/navigation';
  import { latitudStore } from '$lib/stores/latitud';
  import { get } from 'svelte/store';
  import { userStore } from '$lib/stores/user';

  let latitud: number | null = get(latitudStore);

  function saveLatitud() {
    if (latitud !== null) latitudStore.set(latitud);
    goto('/obstacles');
  }

  // Test autenticación login. Borrar luego
  async function login() {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'userTest', password: '123' })
    });

    if (!res.ok) return;

    const authRes = await fetch('/api/auth', { cache: 'no-store' });
    const data = await authRes.json();
    userStore.set(data.user);
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    userStore.set(null);
  }
</script>

<main>
  <h2>Pantalla Location</h2>
  <input type="number" bind:value={latitud} placeholder="Introduce tu latitud" />
  <button on:click={saveLatitud}>Obstáculos</button>
  
  <hr />
  <h4>Prueba user authtication</h4>
  {#if $userStore}
    <p>Logeado como <strong>{$userStore.username}</strong></p>
    <button on:click={logout}>Logout</button>
  {:else}
    <p>No estás logeado</p>
    <button on:click={login}>Login como userTest</button>
  {/if}
</main>