<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
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

<div class="outer">
	<div class="logo">
		<Logo />
	</div>
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
				<h2>Take a moment to pause and reflect.</h2>
				<p>If you have a notebook on hand, jot down your responses.</p>
				<ul>
					<li>Looking at your results, what insights arise for you?</li>
					<li>
						Given what feels wobbly and what feels strong, pick one dynamic that might support your
						own deep, sustained, and courageous climate engagement. How could you invest in it with
						intention? What support do you need?
					</li>
				</ul>
				<div class="actions">
					<!-- TODO: add email action -->
					<button class="btn secondary">Email Your Results</button>
					<a href="https://www.allwecansave.earth/dynamics-resources" class="btn secondary"
						>Resources for Support</a
					>
				</div>
			</div>
		</div>
	</main>
	<footer>
		© 2024 The All We Can Save Project. Developers <a
			href="https://github.com/chelshaw"
			target="_blank"
			rel="noopener nofollow">Chelsea Shaw</a
		>,
		<a href="https://github.com/emikjackson" target="_blank" rel="noopener nofollow">Emi Jackson</a
		>, and
		<a href="https://www.linkedin.com/in/li-helen" target="_blank" rel="noopener nofollow"
			>Helen Li</a
		> brought this interactive tool to life.
	</footer>
</div>

<style>
	.outer {
		background-color: var(--sky);
		min-height: 100vh;
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
	main {
		position: relative;
		padding: 3rem;
		grid-template-columns: 1fr minmax(400px, 1fr);
		grid-template-rows: min-content 1fr;
		gap: 1em 3em;
	}
	.logo {
		height: 120px;
		position: relative;
	}
	.chart {
		grid-column-start: 2;
		grid-column-end: span 1;
		grid-row-start: 1;
		grid-row-end: span 2;
	}
	h1 {
		margin: 0;
		padding: 0;
	}
	h2 {
		font-family: 'adobe-garamond-pro', serif;
		font-weight: 400;
		font-size: 26px;
		line-height: 1.4;
		margin: 0;
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
	.next-steps {
		border: 1px solid var(--charcoal);
		border-radius: 10px;
		background-color: var(--cream);
		padding: 30px;
		margin-top: 2em;
	}
	.next-steps p {
		font-weight: 600;
		font-size: 16px;
	}
	.next-steps li {
		font-size: 15px;
		line-height: 1.6;
	}
	footer {
		text-align: center;
		padding: 2em 3em 4em;
		font-family: 'adobe-garamond-pro', serif;
		font-weight: 400;
		font-size: 18px;
		font-style: italic;
		color: var(--charcoal);
	}
	footer > a {
		color: inherit;
	}
	@media screen and (min-width: 900px) {
		main {
			display: grid;
		}
	}
</style>
