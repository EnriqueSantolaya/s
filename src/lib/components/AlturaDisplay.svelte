<script lang="ts">
  export let altura: number | null = null;
</script>

<div class="input-group">
  <div class="value-label">
    Altura: {altura}°
  </div>

  <div class="altura-container">
    <svg width="120" height="80" viewBox="0 0 120 80">
      {#if altura !== null}
        <!-- Horizonte -->
        <line
          x1="10"
          y1="60"
          x2="110"
          y2="60"
          stroke="black"
          stroke-width="3"
        />

        <!-- Línea inclinada -->
        <g
          style="transform: rotate({-altura}deg); transform-origin: 10px 60px;"
        >
          <line
            x1="10"
            y1="60"
            x2="100"
            y2="60"
            stroke="black"
            stroke-width="3"
          />
        </g>
      {/if}
    </svg>
  </div>
</div>

<style>
  .input-group {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .value-label {
    font-size: 16px;
    font-weight: 500;
    width: 150px;
  }

  .altura-container {
    width: 120px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
