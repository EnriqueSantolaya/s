<script lang="ts">
  import { userStore } from '$lib/stores/user';

  let username = '';
  let password = '';
  let confirmPassword = '';
  let error = '';

  async function signup() {
    error = '';

    if (password !== confirmPassword) {
      error = 'Las contraseñas no coinciden';
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        error = data.error || 'Error al crear la cuenta';
      } else {
        userStore.set({ id: data.id, username: data.username });
        goBack();
      }
    } catch {
      error = 'Error de conexión';
    }
  }

  function goBack() {
    history.back();
}
</script>

<div class="signup-page">
    <div class="signup-form-container">
    <button class="close-btn" on:click={goBack}>×</button>

    <h2>Crear cuenta</h2>

    <form on:submit|preventDefault={signup} class="signup-form">
    <input
        type="text"
        placeholder="Usuario"
        bind:value={username}
        required
    />

    <input
        type="password"
        placeholder="Contraseña"
        bind:value={password}
        required
    />

    <input
        type="password"
        placeholder="Confirmar contraseña"
        bind:value={confirmPassword}
        required
    />

    <button type="submit">Registrarse</button>

    {#if error}
        <p class="error">{error}</p>
    {/if}
    </form>
    </div>
</div>

<style>
  .signup-page {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: calc(100vh - 40px);
    padding: 20px;
    background: linear-gradient(to bottom, #eaf7ff 0%, #ffffff 70%);
    font-family: 'Poppins', system-ui, sans-serif;
  }

  .signup-form-container {
    position: relative;
    width: 100%;
    max-width: 400px;
    background: white;
    border-radius: 16px;
    padding: 32px 24px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 28px;
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
    font-size: 1.3rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 24px;
    text-align: center;
  }

  .signup-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .signup-form input {
    padding: 10px 12px;
    font-size: 0.95rem;
    border-radius: 10px;
    border: 1px solid rgba(15, 23, 42, 0.2);
    width: 100%;
  }

  .signup-form input:focus {
    outline: none;
    border-color: #facc15;
  }

  .signup-form button {
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 600;
    background: #fde047;
    border: 1px solid #facc15;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .signup-form button:hover {
    background: #facc15;
    transform: translateY(-1px);
  }

  .error {
    color: #dc2626;
    font-size: 0.85rem;
    text-align: center;
  }
</style>