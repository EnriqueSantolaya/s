<script lang="ts">
  import 'leaflet/dist/leaflet.css';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { latitudStore } from '$lib/stores/latitud';
  import { get } from 'svelte/store';

  let latitud: number | null = get(latitudStore);
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

    <div>
      <p>Latitud Mapa: {latitudMapa}</p>
      <p>Longitud Mapa: {longitudMapa}</p>
    </div>
  </div>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 40px);
    padding: 6px;
    box-sizing: border-box;
  }
  /* Navegación superior */
  .top-nav {  
    display: flex;
    justify-content: center;
    gap: 60px;
  }

  .nav-circle {
    width: 80px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid black;

    display: flex;
    align-items: center;
    justify-content: center;

    text-align: center;
    font-size: 14px;
    line-height: 1.2;

    user-select: none;
  }

  /* Círculos clicables */
  .nav-circle.clickable {
    cursor: pointer;
  }

  /* Círculo actual (no clicable) */
  .nav-circle.active {
    cursor: default;
    font-weight: bold;
  }

  /* Estilos del mapa y contenedor */
  #map {
    height: 400px; 
    width: 80%; 
    border: 1px solid #000000; 
    position: relative; 
    overflow: hidden; 
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }

  input[type="number"] {
    margin-top: 10px;
    padding: 8px;
    font-size: 16px;
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

  /* Evita estilos raros al hacer focus/click */
  button.nav-circle:focus {
    outline: none;
  }
</style>