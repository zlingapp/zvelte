import { writable } from "svelte/store";

export function mapStore(initialMap = new Map()) {
    const { subscribe, set, update } = writable(initialMap);

    function setMap(key, value) {
        update((map) => {
            map.set(key, value);
            return new Map(map);
        });
    }

    function deleteMap(key) {
        update((map) => {
            map.delete(key);
            return new Map(map);
        });
    }

    function clearMap() {
        set(new Map());
    }

    return {
        subscribe,
        set: setMap,
        delete: deleteMap,
        clear: clearMap,
    };
}
