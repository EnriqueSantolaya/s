import { browser } from '$app/environment';
import { writable } from 'svelte/store';

function createElevacionPlacaStore() {
    const { subscribe, set } = writable<number | null>(null, () => {
        if (browser) {
            const stored = localStorage.getItem('elevacionPlaca');
            if (stored !== null) {
                set(Number(stored));
            }
        }
    });

    return {
        subscribe,
        set: (value: number) => {
            if (browser) {
                localStorage.setItem('elevacionPlaca', value.toString());
            }
            set(value);
        }
    };
}

export const elevacionPlacaStore = createElevacionPlacaStore();