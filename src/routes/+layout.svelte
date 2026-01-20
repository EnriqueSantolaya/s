<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { userStore } from '$lib/stores/user';
  import { clickOutside } from '$lib/actions/clickOutside';
  import "../app.css";

  let showMenu = false;
  let username = '';
  let password = '';
  let error = '';

  async function checkAuth() {
    const res = await fetch('/api/auth');
    const data = await res.json();
    userStore.set(data.user ?? null);
  }

  async function login() {
      error = '';
      try {
          const res = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password })
          });
          const data = await res.json();
          userStore.set({ id: data.id, username: data.username });
          if (!res.ok) {
              error = data.error || 'Error desconocido';
          } else {
              showMenu = false;
          }
      } catch (e) {
          error = 'Error de conexión';
      }
  }

  async function logout() {
      await fetch('/api/logout', { method: 'POST' });
      userStore.set(null);
      showMenu = false;
  }

  onMount(() => {
      checkAuth();
  });
</script>

<div class="app-layout">
  <!-- Línea superior global -->
  <header class="top-bar">
    <div class="left">
      <h1>Solarflow</h1>
    </div>

    <div class="right">
      {#if $userStore}
        <button type="button" on:click={() => goto('/proyectos')}>Lista Proyectos</button>
      {/if}
      <button type="button" on:click={() => goto('/information')}>ℹ️</button>
      <!-- Menú de usuario -->
      <div class="user-menu">
        <button 
          type="button" 
            on:click|stopPropagation={() => showMenu = !showMenu}
            >
            👤
            </button>
        
        {#if showMenu}
          <div class="dropdown" use:clickOutside={() => showMenu = false}>
            {#if $userStore}
              <p>{$userStore.username}</p>
              <button type="button" on:click={logout}>Cerrar sesión</button>
            {:else}
              <form on:submit|preventDefault={login} class="login-form">
                <input type="text" placeholder="Usuario" bind:value={username} required />
                <input type="password" placeholder="Contraseña" bind:value={password} required />
                <button type="submit">Iniciar sesión</button>
                {#if error}<p class="error">{error}</p>{/if}
                <button type="button" class="signup-link" on:click={() => {
                  showMenu = false;
                  goto('/signup');
                }}>
                  Crear cuenta
                </button>
              </form>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </header>

  <!-- Aqui se renderizan las páginas -->
  <main>
    <slot />
  </main>
</div>

<style>
  .top-bar {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;

    font-family: 'Poppins', system-ui, sans-serif;

    background: linear-gradient(
      to top,
      #bde9ff 0%,
      #ffffff 80%
    );

    border-bottom: 1px solid rgba(15, 23, 42, 0.12);
  }

  .top-bar h1 {
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--text-main);
    margin: 0;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .right button {
    border: none;
    background: none;
    padding: 6px;
    font: inherit;
    cursor: pointer;
    color: var(--text-main);
    border-radius: 6px;
    transition: background 0.2s ease, transform 0.1s ease;
  }
  .right button:hover {
    background: rgba(15, 23, 42, 0.05);
  }
  .right button:active {
    transform: scale(0.95);
  }

  .user-menu {
    position: relative;
    display: inline-block;
  }
  .user-menu button {
    font-size: 1.1rem;
  }

  .dropdown {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    background: white;
    border-radius: 12px;
    padding: 14px;
    width: 220px;

    box-shadow:
      0 10px 25px rgba(15, 23, 42, 0.15);
    border: 1px solid rgba(15, 23, 42, 0.08);

    animation: dropdownFade 0.15s ease-out;
    z-index: 10;
  }
  .dropdown p {
    text-align: center;
    margin: 0 0 20px;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .dropdown button {
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    border: none;
    background: var(--sun-400);
    font-weight: 500;
    cursor: pointer;
  }

  .dropdown button:hover {
    background: var(--sun-500);
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .login-form input {
    padding: 8px 10px;
    font-size: 0.9rem;
    border-radius: 8px;
    border: 1px solid rgba(15, 23, 42, 0.15);
  }
  .login-form input:focus {
    outline: none;
    border-color: var(--sun-500);
  }

  .login-form button[type="submit"] {
    background: var(--sun-400);
    border-radius: 8px;
    font-weight: 500;
  }

  .login-form button[type="submit"]:hover {
    background: var(--sun-500);
  }

  .error {
    color: #dc2626;
    font-size: 0.75rem;
  }

  .signup-link {
    margin-top: 4px;
    font-size: 0.75rem;
    background: none;
    border: none;
    color: #0284c7;
    cursor: pointer;
  }
  
  main {
    height: calc(100vh - 40px);
  }

  @keyframes dropdownFade {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    .top-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;

      height: 56px;
      padding: 0 12px;

      border-top: 1px solid rgba(15, 23, 42, 0.12);
      border-bottom: none;

      background: white;
      box-shadow: 0 -6px 20px rgba(15, 23, 42, 0.15);

      z-index: 100;
    }

    .top-bar h1 {
      font-size: 1rem;
    }

    .right button {
      padding: 10px;
      font-size: 1.1rem;
    }

    .dropdown {
      top: calc(100% + 8px);
      bottom: auto;
    }

    main {
      height: auto;
      padding-top: 56px; 
    }
  }
</style>