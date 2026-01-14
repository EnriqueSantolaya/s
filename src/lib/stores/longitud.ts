import { browser } from '$app/environment';
import { writable } from 'svelte/store';

function createLongitudStore() {
  const { subscribe, set } = writable<number | null>(null, () => {
    if (browser) {
      const stored = localStorage.getItem('longitud');
      if (stored !== null) {
        set(Number(stored));
      }
    }
  });

  return {
    subscribe,
    set: (value: number | null) => {
      if (browser) {
        if (value === null) {
          localStorage.removeItem('longitud');
        } else {
          localStorage.setItem('longitud', value.toString());
        }
      }
      set(value);
    }
  };
}

export const longitudStore = createLongitudStore();
