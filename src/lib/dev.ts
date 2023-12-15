import { showInErrorModal } from "src/lib/stores";

export function error(err: string) {
    showInErrorModal.set(err);
}

export function unimplemented() {
    showInErrorModal.set("Unimplemented");
}