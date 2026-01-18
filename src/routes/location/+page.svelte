<script lang="ts">
  import 'leaflet/dist/leaflet.css';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { latitudStore } from '$lib/stores/latitud';
  import { longitudStore } from '$lib/stores/longitud';
  import { get } from 'svelte/store';
  import TopNav from '$lib/components/TopNav.svelte';

  let latitud: number | null = get(latitudStore);
  let longitud: number | null = get(longitudStore);
  let map: any;
  let marker: any = null;
  let latitudPorDefecto  = 41.6488;
  let longitudPorDefecto  = -0.8891;

  onMount(async () => {
    const L = await import('leaflet');
    L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/';

    const centroLat = (latitud !== null && longitud !== null) ? latitud : latitudPorDefecto;
    const centroLng = (latitud !== null && longitud !== null) ? longitud : longitudPorDefecto;

    map = L.map('map').setView([centroLat, centroLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    if (latitud === null && longitud === null) {
      latitud = latitudPorDefecto;
      longitud = longitudPorDefecto;
      latitudStore.set(latitud);
      longitudStore.set(longitud);

      marker = L.marker([latitud, longitud]).addTo(map);

    } else if (latitud !== null && longitud !== null) {
      marker = L.marker([latitud!, longitud!]).addTo(map);
    } else {
      marker = null;
    }

    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      if (!marker) {
        marker = L.marker([lat, lng]).addTo(map);
      } else {
        marker.setLatLng([lat, lng]);
      }
      latitud = lat;
      longitud = lng;
      latitudStore.set(latitud);
      longitudStore.set(longitud);
    });

    // Esperar un tick para que el contenedor tenga tamaño real
    setTimeout(() => {
      map.invalidateSize(); 
    }, 100);
  });

  function onLatitudInput() {
    latitudStore.set(latitud!);

    longitud = null;
    longitudStore.set(null as any);

    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }
  }
</script>

<div class="page">

  <!-- Navegación superior -->
  <TopNav active="localizacion" />

  <div class="container">
    <h2>Selecciona en el mapa o elige la latitud</h2>
    <p>Pulsa y arrastra para moverte en el mapa, haz click para seleccionar la localización</p>
    
    <!-- Map Container -->
    <div id="map"></div>

    <!-- Latitude Input -->
    <div>
      <label for="latitude">Latitud:</label>
      <input 
        type="number" 
        id="latitude" 
        bind:value={latitud} 
        step="any" 
        placeholder="Introduce la latitud"
        on:input={onLatitudInput}
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
  }

  /* Estilos del mapa y contenedor */
  #map {
    box-sizing: border-box;
    height: 400px; 
    width: 100%; 
    border-radius: 14px;
    border: 1px solid rgba(15, 23, 42, 0.15);
    overflow: hidden;

    box-shadow:
      0 6px 20px rgba(15, 23, 42, 0.15);

    margin-bottom: 12px;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: clamp(280px, 90%, 600px);
    background: white;
    border-radius: 20px;
    padding: 24px;
    margin: 0 auto;


    box-shadow:
      0 10px 30px rgba(15, 23, 42, 0.12);
  }
  .container h2 {
    margin-top: 8px;
    margin-bottom: 10px;
    font-size: 1.2rem;
    font-weight: 600;
    color: #0f172a;
  }
  .container p {
    margin-top: 4px;
    margin-bottom: 12px;
    font-size: 0.8rem;
    color: rgba(15, 23, 42, 0.7);
  }

  label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #0f172a;
  }

  input[type="number"] {
    margin-top: 12px;
    margin-bottom: 8px;
    padding: 6px 12px;
    font-size: 0.9rem;

    border-radius: 10px;
    border: 1px solid rgba(15, 23, 42, 0.2);

    width: 220px;
  }
  input[type="number"]:focus {
    outline: none;
    border-color: #facc15;
  }

  .bottom-button {
    align-self: center;

    padding: 12px 24px;
    width: 220px;

    margin-top: 24px;
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