import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type ConfigAvanzada = {
    altura: number | null;
    acimut: number | null;
    meses: number[] | null;
};

function createConfigAvanzadaStore() {
    const { subscribe, update } = writable<ConfigAvanzada>({
        altura: null,
        acimut: null,
        meses: null
    }, () => {
        if (!browser) return;
        
        const storedAltura = localStorage.getItem('altura');
        const storedAcimut = localStorage.getItem('acimut');
        const storedMeses = localStorage.getItem('meses');

        update(() => ({
            altura: storedAltura ? Number(storedAltura) : null,
            acimut: storedAcimut ? Number(storedAcimut) : null,
            meses: storedMeses ? JSON.parse(storedMeses) : null
        }));
    });

    return {
        subscribe,
        setConfig: (values: Partial<ConfigAvanzada>) => {
            update(current => {
                const newValues: ConfigAvanzada = { ...current };

                if (browser) {
                    // Altura
                    if (values.altura == null) {
                        localStorage.removeItem('altura');
                        newValues.altura = null;
                    } else {
                        localStorage.setItem('altura', values.altura.toString());
                        newValues.altura = values.altura;
                    }

                    // Acimut
                    if (values.acimut == null) {
                        localStorage.removeItem('acimut');
                        newValues.acimut = null;
                    } else {
                        localStorage.setItem('acimut', values.acimut.toString());
                        newValues.acimut = values.acimut;
                    }

                    // Meses
                    if (!values.meses || values.meses.length === 0) {
                        localStorage.removeItem('meses');
                        newValues.meses = null;
                    } else {
                        localStorage.setItem('meses', JSON.stringify(values.meses));
                        newValues.meses = values.meses;
                    }

                } else {
                    // si no hay browser, solo actualizamos memoria
                    newValues.altura = values.altura ?? current.altura;
                    newValues.acimut = values.acimut ?? current.acimut;
                    newValues.meses = values.meses ?? current.meses;
                }
                
                return newValues;
            });
        }
    };
}

export const configAvanzadaStore = createConfigAvanzadaStore();