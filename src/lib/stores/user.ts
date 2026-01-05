import { writable } from 'svelte/store';

export const userStore = writable<{ id: string; username: string } | null>(null);