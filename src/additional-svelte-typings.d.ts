declare namespace svelteHTML {
    // enhance elements
    interface IntrinsicElements {}
    // enhance attributes
    interface HTMLAttributes<T> {
        'on:click_outside'?: (event: any) => void;
    }
}