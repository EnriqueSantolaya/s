import { writable } from 'svelte/store';
import type { Obstacle } from '$lib/obstacles';

function loadObstacles(): Obstacle[] {
    const stored = localStorage.getItem('obstacles');
    if (!stored) return [];
    try {
        return JSON.parse(stored) as Obstacle[];
    } catch {
        return [];
    }
}

function saveObstacles(obs: Obstacle[]) {
    localStorage.setItem('obstacles', JSON.stringify(obs));
}

function createObstaclesStore() {
    const { subscribe, set, update } = writable<Obstacle[]>(loadObstacles());

    return {
        subscribe,
        set: (obs: Obstacle[]) => {
            saveObstacles(obs);
            set(obs);
        },
        update: (fn: (obs: Obstacle[]) => Obstacle[]) => {
            update(current => {
                const newObs = fn(current);
                saveObstacles(newObs);
                return newObs;
            });
        }
    };
}

export const obstaclesStore = createObstaclesStore();