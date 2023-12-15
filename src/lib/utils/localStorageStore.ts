import { get, writable } from "svelte/store";

export function localStorageWritable<T>(localStorageKey: string, value?: T, parser?: (stored: string) => T) {
    const store = writable<T>(value);

    if (localStorage[localStorageKey] && localStorage[localStorageKey] != "undefined") {
        let stored;
        if (parser) {
            // custom parser
            stored = parser(localStorage[localStorageKey]);
        } else {
            // simple JSON parser
            stored = JSON.parse(localStorage[localStorageKey]);
        }
        store.set(stored);
    } else {
        localStorage[localStorageKey] = JSON.stringify(value);
    }

    return {
        subscribe: store.subscribe,
        set(value: T) {
            localStorage[localStorageKey] = JSON.stringify(value);
            store.set(value);
        },
        update(fn: Function) {
            const updated = fn(get(store));
            localStorage[localStorageKey] = JSON.stringify(updated);
            store.set(updated);
        }
    }
}