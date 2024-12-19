<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { trapFocus } from 'trap-focus-svelte';

	let { children, handleClose } = $props();

	// Prevent body from scrolling when modal is open
	onMount(() => {
		if (browser) {
			document.body.style.overflow = 'hidden';
		}
	});

	onDestroy(() => {
		if (browser) {
			document.body.style.overflow = 'auto';
		}
	});

	// Close the modal on escape key press
	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			handleClose();
		}
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="wrapper" role="dialog" aria-modal="true">
	<div class="tile" use:trapFocus>
		{@render children()}
	</div>
</div>

<style>
	.wrapper {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		height: 100dvh;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px;
		box-sizing: border-box;
	}
	.tile {
		width: 450px;
		max-width: 100%;
		box-sizing: border-box;
		padding: 30px;
		box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.2);
		border-radius: 10px;
		background-color: var(--sky);
		max-height: 95vh;
		max-height: calc(100dvh - 20px);
		overflow: auto;
		margin: 10px 0px;
	}
</style>
