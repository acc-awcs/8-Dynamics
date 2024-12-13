<script lang="ts">
	import SpiderChart from '$lib/components/SpiderChart.svelte';
	import dynamics from '$lib/dynamics';
	import { onDestroy, onMount } from 'svelte';

	const INTERVAL = 1500;
	let { data } = $props();
	let highlight = $state(0);
	let intervalId = $state<number>();
	let chartWidth = $state(500);

	function rotateSelected() {
		let selected = highlight + 1;
		if (selected >= dynamics.length) {
			selected = 0;
		}
		// side-effect
		highlight = selected;
	}

	onMount(() => {
		if (!intervalId) {
			intervalId = setInterval(rotateSelected, INTERVAL);
		}
	});
	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

<main>
	<h1 class="title">Your Results</h1>
	<div class="chart" aria-hidden="true" bind:clientWidth={chartWidth}>
		<SpiderChart answers={data.object} {highlight} {chartWidth} />
	</div>
	<div class="results">
		<ol>
			{#each dynamics as dynamic, idx}
				<li class:highlight={idx === highlight}>
					{dynamic.full}
					<span class="visually-hidden">Your answer: {data.answers[idx].value} out of 5</span>
				</li>
			{/each}
		</ol>
		<div class="next-steps">
			<h2>If you have a notebook on hand, jot down your responses.</h2>
			<ul>
				<li>Looking at your results, what insights arise for you?</li>
				<li>
					Given what feels wobbly and what feels strong, pick one dynamic that might support your
					own deep, sustained, and courageous climate engagement. How could you invest in it with
					intention? What support do you need?
				</li>
			</ul>
			<div class="actions">
				<!-- TODO: add actions and link -->
				<button class="btn secondary">Email Your Results</button>
				<a href="#" class="btn secondary">Resources for Support</a>
			</div>
		</div>
	</div>
</main>

<style>
	main {
		background-color: var(--sky);
		padding: 3rem;
		min-height: 100vh;
		position: relative;
		grid-template-columns: 1fr minmax(400px, 1fr);
		grid-template-rows: min-content 1fr;
		gap: 1em 3em;
		background-image: url('$lib/assets/cloud-1.png'), url('$lib/assets/cloud-4.png'),
			url('$lib/assets/cloud-5.png');
		background-repeat: no-repeat, no-repeat, no-repeat;
		background-blend-mode: overlay, overlay, overlay;
		background-position:
			bottom left,
			bottom 0 right -100px,
			bottom right;
		background-size: 485px, 504px, 503px;
	}
	h1 {
		margin: 0;
		padding: 0;
	}
	h2 {
		font-family: 'adobe-garamond-pro', serif;
		font-weight: 400;
		font-size: 18px;
		line-height: 1.4;
		margin-top: 0;
	}
	.actions {
		margin-top: 1.2em;
		display: flex;
		gap: 1.5em;
	}
	ol {
		padding: 0 1em;
	}
	ol li {
		margin-bottom: 1em;
	}
	ul {
		padding-inline-start: 20px;
	}
	li.highlight {
		font-weight: bold;
	}
	.chart {
		grid-column-start: 2;
		grid-column-end: 2;
		grid-row-start: 1;
		grid-row-end: span 2;
	}
	.next-steps {
		border: 1px solid var(--charcoal);
		border-radius: 10px;
		background-color: var(--cream);
		padding: 30px;
		margin-top: 2em;
	}
	.next-steps li {
		line-height: 1.6;
	}
	@media screen and (min-width: 900px) {
		main {
			display: grid;
		}
	}
</style>
