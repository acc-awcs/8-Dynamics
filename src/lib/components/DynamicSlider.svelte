<script lang="ts">
	import dynamics, { rotateDynamic } from '$lib/dynamics';
	import Arrow from './Arrow.svelte';

	let {
		highlight = 0,
		answers,
		onHover,
		onLeave
	}: {
		highlight: number;
		answers: string[];
		onHover: CallableFunction;
		onLeave: CallableFunction;
	} = $props();

	function onArrowClick(delta: number) {
		const selected = rotateDynamic(highlight, delta);
		onHover(selected);
	}
</script>

<div class="mobile">
	<div class="interactive">
		<Arrow direction="left" onClick={() => onArrowClick(-1)} />
		{highlight + 1}
		<Arrow direction="right" onClick={() => onArrowClick(1)} />
	</div>
	<p>
		{dynamics[highlight].full}
		<span class="visually-hidden">Your answer: {answers[highlight]} out of 5</span>
	</p>
</div>
<!-- non-mobile -->
<ol>
	{#each dynamics as dynamic, idx}
		<li
			class:highlight={idx === highlight}
			ontouchstart={() => onHover(idx)}
			onmouseenter={() => onHover(idx)}
			onmouseleave={() => onLeave()}
		>
			{dynamic.full}
			<span class="visually-hidden">Your answer: {answers[idx]} out of 5</span>
		</li>
	{/each}
</ol>

<style>
	.mobile {
		font-size: 24px;
		text-align: center;
		font-weight: 600;
		margin: 2em 0;
	}
	.mobile div {
		display: flex;
		justify-content: center;
		gap: 20px;
		margin: 0.5em auto;
	}
	.mobile p {
		font-size: 16px;
		line-height: 1.4;
		max-width: 300px;
		margin: 0 auto;
	}
	ol {
		display: none;
		padding: 0 1.4em;
	}
	ol li {
		margin-bottom: 1em;
	}
	li.highlight {
		font-weight: bold;
	}
	@media screen and (min-width: 900px) {
		.mobile {
			display: none;
		}
		ol {
			display: block;
		}
	}
</style>
