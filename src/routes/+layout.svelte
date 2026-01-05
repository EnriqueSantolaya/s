<script>
  import "../app.css";
</script>

<div class="app-layout">
  <!-- Línea superior global -->
  <header class="top-bar">
    <div class="left">
      <h1>Solarflow</h1>
    </div>

    <div class="right">
      <button type="button">ℹ️</button>
      <button type="button">👤</button>
    </div>
  </header>

  <!-- Aquí se renderizan tus páginas -->
  <main>
    <slot />
  </main>
</div>

<style>
  .top-bar {
    height: 40px;
    border-bottom: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    box-sizing: border-box;
  }

  .right button {
    border: none;
    background: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
  }

  main {
    height: calc(100vh - 40px);
  }
</style>