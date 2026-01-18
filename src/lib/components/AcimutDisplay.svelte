<script lang="ts">
  export let acimut: number | null = null;
</script>

<div class="input-group">
  <div class="value-label">
    Orientación: {acimut}°
  </div>

  <div class="arrow-container">
    <svg width="80" height="80" viewBox="0 0 100 100">
      <!-- N fija -->
      <text x="50" y="10" text-anchor="middle" font-size="14">
        N
      </text>

      {#if acimut !== null}
        <g
          style="transform: rotate({-(acimut) + 180}deg); transform-origin: 50% 50%;"
        >
          <line x1="50" y1="80" x2="50" y2="20" stroke="black" stroke-width="4" />
          <polygon points="50,10 42,25 58,25" fill="black" />
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

  .arrow-container {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
