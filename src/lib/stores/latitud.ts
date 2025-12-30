import { browser } from '$app/environment';
import { writable } from 'svelte/store';

function createLatitudStore() {
    const { subscribe, set } = writable<number | null>(null, () => {
        if (browser){
            const stored = localStorage.getItem('latitud');
            if (stored) set(Number(stored));
        }
    });

    return {
        subscribe,
        set: (value: number) => {
            if (browser) {
                localStorage.setItem('latitud', value.toString());
            }
            set(value);
        }
    };
}

export const latitudStore = createLatitudStore();
