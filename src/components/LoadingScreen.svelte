<script lang="ts">
    import { fade } from "svelte/transition";
    import SvgSpinnersRingResize from '~icons/svg-spinners/ring-resize';
</script>

<div class="loading-screen" out:fade={{delay: 500, duration: 200}}>
    <!-- svelte-ignore a11y-missing-attribute -->
    <img src="/apple-touch-icon.png" class="logo" />
    <div class="spinner">
        <SvgSpinnersRingResize font-size="32px" />
    </div>
    <div class="didyouknow">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>Did You Know</label>
        <p>
            The Ministry of Unfinished Research<br>has concluded that 1 in 3 people
        </p>
    </div>
</div>

<style>
    .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        background-color: var(--bg-2);
        z-index: 1000;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        user-select: none;
        pointer-events: none;
    }

    .spinner {
        color: var(--accent-color);
        margin-top: 62px;
    }

    .logo {
        width: 128px;
        height: 128px;
        animation: bounce 0.5s ease-out infinite;
        border-radius: 50%;
    }

    /* bouncing animation for the logo with outline expanding */
    @keyframes bounce {
        0% {
            transform: rotate(0);
        }
        25% {
            transform: rotate(1.5deg);
        }
        75% {
            transform: rotate(-1.5deg);
        }
        100% {
            transform: rotate(0);
        }
    }

    .didyouknow {
        position: absolute;
        bottom: 100px;
        text-align: center;
        color: var(--gray);
    }
</style>
