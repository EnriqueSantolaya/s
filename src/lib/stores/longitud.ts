import { browser } from '$app/environment';
import { writable } from 'svelte/store';

function createLongitudStore() {
    const { subscribe, set } = writable<number | null>(null, () => {
        if (browser) {
            const stored = localStorage.getItem('longitud');
            if (stored) set(Number(stored));
        }
    });

    return {
        subscribe,
        set: (value: number) => {
            if (browser) {
                localStorage.setItem('longitud', value.toString());
            }
            set(value);
        }
    };
}

export const longitudStore = createLongitudStore();
