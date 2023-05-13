import { showInErrorModal } from "./stores";

export function error(err: string) {
    showInErrorModal.set(err);
}

export function unimplemented() {
    showInErrorModal.set("Unimplemented");
}