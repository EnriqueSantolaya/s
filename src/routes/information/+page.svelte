<script lang="ts">

    function goBack() {
        history.back();
    }
</script>

<div class="information-page">
    <div class="information-container">
        
    <button class="close-btn" on:click={goBack}>×</button>
    <h2>Información</h2>

    <h5>Método diseñado</h5>
    <p>
        Esta aplicación utiliza un método avanzado para optimizar la orientación e inclinación de los paneles solares a partir
        del análisis de la radiación solar a lo largo de todo el año. En lugar de basarse en una estimación puntual, el sistema
        integra la radiación instantánea en cada momento relevante, transformándola en una estimación anual de la energía
        captada. Además, el método tiene en cuenta factores reales como sombras proyectadas por edificios, árboles u otros
        obstáculos, descartando los instantes en los que la radiación queda bloqueada. Esto permite comparar múltiples
        configuraciones y determinar la posición que maximiza la producción energética, incluso cuando existen restricciones
        físicas que impiden adoptar la orientación ideal.
    </p>

    <h5>Método clásico</h5>
    <p>
        En contraste, los métodos clásicos utilizados habitualmente se basan en fórmulas empíricas que relacionan la inclinación
        del panel únicamente con la latitud, asumiendo además una orientación general hacia el sur o el norte según el
        hemisferio. Aunque este enfoque puede ofrecer resultados aceptables en condiciones ideales, no considera la variación
        real de la radiación solar ni el impacto de sombras u obstáculos locales. Como consecuencia, la estimación de energía
        producida puede alejarse significativamente de la realidad. El enfoque de esta aplicación supera estas limitaciones
        al ofrecer un análisis personalizado y mucho más preciso para cada ubicación.
    </p>

    <h5>Explicación Términos</h5>
    <li>
        <strong>latitud</strong> : La latitud geográfica del lugar donde se instalarán los paneles solares,
        medida en grados. La latitud influye en la trayectoria del sol a lo largo del año y, por tanto, en la cantidad de 
        radiación solar recibida.
    </li>
    <li>
        <strong>Acimut:</strong> Ángulo horizontal que indica la dirección hacia la que apunta el panel solar, medido en grados
        desde el sur (0°) en sentido horario. Por ejemplo, 90° corresponde al este y -90° al oeste.
    </li>
    <li>
        <strong>Altura:</strong> Ángulo vertical que indica la inclinación del panel solar respecto al suelo, medida en grados.
        Una altura de 0° significa que el panel está completamente horizontal, mientras que 90° indica una posición vertical.
    </li>
    <li>
        <strong>Meses de no funcionamiento:</strong> Meses del año en los que el sistema fotovoltaico no estará operativo,
        ya sea por mantenimiento, condiciones climáticas adversas u otras razones. Estos meses se excluyen del cálculo de
        la orientación e inclinación óptimas del panel solar.
    </li>

    <h5>Instrucciones de uso de la aplicación</h5>
    <p>
        Para utilizar la aplicación, primero navega a la sección de localización e ingresa la latitud del lugar donde se 
        instalarán los paneles solares. A continuación, puedes introducir obstáculos que puedan proyectar sombras sobre 
        los paneles, como edificios o árboles, especificando su posición, distancia, altura, el tipo y el factor de anchura, 
        que representá la relación entre la anchura y la altura del obstáculo. Después se continua a la sección de configuración 
        avanzada, donde puedes definir restricciones en la orientación (acimut) e inclinación (altura) de los paneles, así como 
        seleccionar los meses en los que el sistema no funcionará. Finalmente, selecciona la opción para calcular la mejor 
        posición de los paneles solares. La aplicación procesará los datos y te mostrará la orientación e inclinación óptimas, 
        junto con una comparación con una instalación realizada por el método clásico y una estimación de la energía generada a 
        lo largo de los meses seleccionados. Por último, si tienes una cuenta, puedes guardar el proyecto para futuras referencias.
    </p>
    </div>
</div>

<style>
  .information-page {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: calc(100vh - 40px);
    padding: 20px;
    background: linear-gradient(to bottom, #eaf7ff 0%, #ffffff 70%);
    font-family: 'Poppins', system-ui, sans-serif;
  }

  .information-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    background: white;
    border-radius: 16px;
    padding: 32px 24px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    display: flex;
    flex-direction: column;
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
    text-align: center;
    margin-bottom: 24px;
  }

  h5 {
    font-size: 1rem;
    font-weight: 600;
    color: #0f172a;
    margin-top: 16px;
    margin-bottom: 6px;
  }

  p, li {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #0f172a;
    text-align: left;
  }

  p {
    margin-bottom: 16px;
  }

  li {
    max-width: 700px;
    margin-bottom: 12px;
  }
</style>

