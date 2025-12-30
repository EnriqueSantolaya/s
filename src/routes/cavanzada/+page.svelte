<script lang="ts">
    import { goto } from '$app/navigation';
    import { configAvanzadaStore } from '$lib/stores/configAvanzada';
    import { onMount } from 'svelte';

    let altura: number | null = null;
    let acimut: number | null = null;
    let mesesInput: string = "";
    let meses: number[] | null = null;

    const save = () => {
        meses = mesesInput
            ? mesesInput.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n))
            : null;

        configAvanzadaStore.setConfig({ altura, acimut, meses });
        next();
    };

    onMount(() => {
        const unsubscribe = configAvanzadaStore.subscribe(values => {
            altura = values.altura;
            acimut = values.acimut;
            meses = values.meses;
            mesesInput = values.meses ? values.meses.join(',') : '';
        });
        unsubscribe(); 
    });

    function next() {
        goto('/resultado');
    }
</script>

<h2>Configuración Avanzada</h2>

<input type="number" bind:value={altura} placeholder="Altura" />
<input type="number" bind:value={acimut} placeholder="Acimut" />
<input type="text" bind:value={mesesInput} placeholder="Meses (1,2,3...)" />

<button on:click={save}>Calcular</button>