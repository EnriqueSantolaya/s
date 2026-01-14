<script>
  import { goto } from '$app/navigation';

  export let active = ''; // 'localizacion' | 'obstacles' | 'cavanzada' | 'resultado'

  const items = [
    { id: 'localizacion', label: 'Localización', path: '/location' },
    { id: 'obstacles', label: 'Obstáculos', path: '/obstacles' },
    { id: 'cavanzada', label: 'C. Avanzada', path: '/cavanzada' }
  ];

  $: activeIndex = active === 'resultado' ? -1 : items.findIndex(i => i.id === active);
</script>

<div class="top-nav">
  {#each items as item, index}
    <div class="nav-step">
      {#if index === activeIndex}
        <div class="nav-circle active">{item.label}</div>
      {:else}
        <button
          type="button"
          class="nav-circle clickable {active === 'resultado' || index < activeIndex ? 'completed' : 'next'}"
          on:click={() => goto(item.path)}
        >
          {item.label}
        </button>
      {/if}

      {#if index < items.length - 1}
        <div
          class="connector {active === 'resultado' || index < activeIndex ? 'completed' : 'next'}"
        ></div>
      {/if}
    </div>
  {/each}
</div>

<style>
.top-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  gap: 0;
}

.nav-step {
  display: flex;
  align-items: center;
}

/* Círculos */
.nav-circle {
  width: 90px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 13px;
  line-height: 1.2;
  user-select: none;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1; 
}

/* Paso anterior */
.nav-circle.completed {
  background: #fde047;
  border: 1px solid #facc15;
}

/* Paso actual */
.nav-circle.active {
  font-weight: 600;
  background: #fde047;
  border: 1px solid #facc15;
  box-shadow: 0 4px 10px rgba(250, 204, 21, 0.4);
  cursor: default;
}

/* Paso siguiente */
.nav-circle.next {
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.15);
}

.nav-circle.clickable {
  cursor: pointer;
}

.nav-circle.clickable:hover {
  background: #f8fafc;
  transform: translateY(-2px);
}

.connector {
  flex-shrink: 0;
  width: 70px;
  height: 5px;
  border-radius: 3px;
  background: rgba(15, 23, 42, 0.15);
  margin-left: -10px; 
  z-index: 0; 
  transition: background 0.2s;
}

.connector.completed {
  background: #facc15;
}

.connector.next {
  background: rgba(15, 23, 42, 0.15);
}
</style>
