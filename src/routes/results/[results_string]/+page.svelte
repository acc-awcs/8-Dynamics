<script lang="ts">
	import SpiderChart from '$lib/components/SpiderChart.svelte';
	import dynamics from '$lib/dynamics';
	import { _sendEmail } from './+page';

	export let data;
	let email = '';

	function handleEmailChange(evt: Event): void {
		const input = evt.target as HTMLInputElement;
		email = input.value;
	}
</script>

<main>
	<h1 class="title">Your Results</h1>
	<div class="chart">
		<SpiderChart answers={data.object} />
	</div>
	<ol>
		{#each dynamics as dynamic}
			<li>{dynamic.full}</li>
		{/each}
	</ol>
	<div>Send a copy of your results:</div>
	<form
		on:submit={async (e) => {
			e.preventDefault();
			const resp = await _sendEmail(email, data.object);
			if (resp.success) {
				alert('Email sent!');
			} else {
				alert("Sorry! Something went wrong and we couldn't send the email.");
			}
		}}
	>
		<input value={email} on:input={handleEmailChange} placeholder="Email address" />
		<!-- TODO: email validation -->
		<button type="submit">Submit</button>
	</form>
</main>

<style>
	main {
		background-color: var(--sky);
		padding: 3rem;
		min-height: 100vh;
		position: relative;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: min-content 1fr;
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
	ol {
		padding: 2em 1em;
		line-height: 2;
	}
	.chart {
		grid-column-start: 2;
		grid-column-end: 2;
		grid-row-start: 1;
		grid-row-end: span 2;
	}
	@media screen and (min-width: 900px) {
		main {
			display: grid;
		}
	}
</style>
