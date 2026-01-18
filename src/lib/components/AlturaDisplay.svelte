<script lang="ts">
  export let altura: number | null = null;
  $: inclinacion = altura !== null ? 90 - altura : null;
</script>

<div class="input-group">
  <div class="value-label">
    Inclinación: {inclinacion}°
  </div>

  <div class="altura-container">
    <svg width="120" height="80" viewBox="0 0 120 80">
      {#if inclinacion !== null}
        <!-- Origen -->
        <circle cx="20" cy="60" r="2" fill="black" />

        <!-- Horizontal -->
        <line
          x1="20"
          y1="60"
          x2="110"
          y2="60"
          stroke="black"
          stroke-width="3"
        />

        <!-- Placa inclinada -->
        <g
          style="
            transform: rotate({-inclinacion}deg);
            transform-origin: 20px 60px;
          "
        >
          <line
            x1="20"
            y1="60"
            x2="90"
            y2="60"
            stroke="#facc15"
            stroke-width="4"
            stroke-linecap="round"
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
