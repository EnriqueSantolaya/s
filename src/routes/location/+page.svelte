<script lang="ts">
  import 'leaflet/dist/leaflet.css';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { latitudStore } from '$lib/stores/latitud';
  import { get } from 'svelte/store';

  let latitud: number | null = get(latitudStore);
  let longitud: number | null = null;
  let map: any;
  let latitudMapa = 41.6488;
  let longitudMapa = -0.8891;

  onMount(async () => {
    const L = await import('leaflet');
    L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/';

    map = L.map('map').setView([latitudMapa, longitudMapa], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker([latitudMapa, longitudMapa]).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      marker.setLatLng([lat, lng]);
      latitudMapa = lat;
      longitudMapa = lng;
      latitud = lat;
      if (latitud !== null) latitudStore.set(latitud);
    });

    // Esperar un tick para que el contenedor tenga tamaño real
    setTimeout(() => {
      map.invalidateSize(); // Esto fuerza a Leaflet a recalcular los tiles
    }, 100);
  });
</script>

<div class="page">

  <!-- Navegación superior -->
  <div class="top-nav">
    <div class="nav-circle active">
      Localización
    </div>

    <button
      type="button"
      class="nav-circle clickable"
      on:click={() => goto('/obstacles')}
    >
      Obstáculos
    </button>

    <button
      type="button"
      class="nav-circle clickable"
      on:click={() => goto('/cavanzada')}
    >
      C. Avanzada
    </button>
  </div>

  <div class="container">
    <h2>Selecciona en el mapa o elige la latitud</h2>
    <p>Pulsa y arrastra para moverte en el mapa, y haz click para seleccionar la localización</p>
    
    <!-- Map Container -->
    <div id="map" style="height: 400px; width: 80%; border: 1px solid black;"></div>

    <!-- Latitude Input -->
    <div>
      <label for="latitude">Latitud:</label>
      <input 
        type="number" 
        id="latitude" 
        bind:value={latitud} 
        step="any" 
        placeholder="Introduce la latitud"
      />
    </div>

  </div>

  <button class="bottom-button" on:click={() => goto('/obstacles')}>Continuar</button>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 40px);
    padding: 12px;
    box-sizing: border-box;

    background: linear-gradient(
      to bottom,
      #eaf7ff 0%,
      #ffffff 70%
    );

    font-family: 'Poppins', system-ui, sans-serif;
  }

  /* Navegación superior */
  .top-nav {  
    display: flex;
    justify-content: center;
    gap: 60px;
    margin-bottom: 16px;
  }

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

    background: white;
    border: 1px solid rgba(15, 23, 42, 0.15);
    color: #0f172a;

    transition: all 0.2s ease;
  }

  /* Círculos clicables */
  .nav-circle.clickable {
    cursor: pointer;
  }
  .nav-circle.clickable:hover {
    background: #f8fafc;
    transform: translateY(-2px);
  }

  /* Círculo actual (no clicable) */
  .nav-circle.active {
    font-weight: 600;
    background: #fde047;
    border-color: #facc15;
    box-shadow: 0 4px 10px rgba(250, 204, 21, 0.4);
    cursor: default;
  }

  /* Estilos del mapa y contenedor */
  #map {
    height: 400px; 
    width: 80%; 
    border-radius: 14px;
    border: 1px solid rgba(15, 23, 42, 0.15);
    overflow: hidden;

    box-shadow:
      0 6px 20px rgba(15, 23, 42, 0.15);

    margin-bottom: 16px;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;

    background: white;
    border-radius: 16px;
    padding: 12px;
    margin: 0 auto;

    width: 100%;
    max-width: 900px;

    box-shadow:
      0 10px 30px rgba(15, 23, 42, 0.12);
  }
  .container h2 {
    margin-top: 0;
    margin-bottom: 2px;
    font-size: 1.2rem;
    font-weight: 600;
    color: #0f172a;
  }
  .container p {
    margin: 4px 0;
    font-size: 0.8rem;
    color: rgba(15, 23, 42, 0.7);
  }

  label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #0f172a;
  }

  input[type="number"] {
    margin-top: 6px;
    padding: 10px 12px;
    font-size: 0.9rem;

    border-radius: 10px;
    border: 1px solid rgba(15, 23, 42, 0.2);

    width: 220px;
  }
  input[type="number"]:focus {
    outline: none;
    border-color: #facc15;
  }

  button.nav-circle {
    background: none;
    padding: 0;
    margin: 0;
    outline: none;
    border: 1px solid black;

    width: 80px;
    height: 60px;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-family: inherit;
    font-size: 14px;
    line-height: 1.2;
    color: inherit;
  }

  button.nav-circle:focus {
    outline: none;
  }

  .bottom-button {
    align-self: center;
    margin-top: auto;

    padding: 12px 24px;
    width: 220px;

    margin-top: 10px;
    margin-bottom: 10px;

    font-size: 1rem;
    font-weight: 600;

    background: #fde047;
    border: 1px solid #facc15;
    border-radius: 12px;

    cursor: pointer;
    transition: all 0.2s ease;
  }

  .bottom-button:hover {
    background: #facc15;
    transform: translateY(-1px);
  }
</style>