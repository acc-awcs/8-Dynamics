<script lang="ts">
	let {
		direction = 'right',
		onClick = () => {}
	}: { direction: string; onClick: CallableFunction } = $props();

	function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		event.preventDefault();
		onClick();
	}
</script>

<button onclick={handleClick}>
	<svg class:left={direction === 'left'} viewBox="0 0 44 18" xmlns="http://www.w3.org/2000/svg">
		<!-- Fallback/A11y text -->
		{#if direction === 'left'}
			Previous
		{:else}
			Next
		{/if}
		<path d="M34.1477 1.39111L41.9321 9.17551L34.1477 16.9599"></path>
		<path d="M1.19088 9.16982H40.6755"></path>
	</svg>
</button>

<style>
	button {
		background: none;
		border: none;
		cursor: pointer;
	}
	button:hover path {
		stroke-width: 3px;
	}
	svg {
		position: relative;
		display: block;
		margin: 0 auto;
		width: 36px;
		height: 36px;
	}
	svg.left {
		transform: rotate(180deg);
	}
	path {
		stroke: var(--charcoal);
		stroke-width: 2px;
		stroke-linejoin: round;
		stroke-linecap: round;
		fill: none;
	}
</style>
