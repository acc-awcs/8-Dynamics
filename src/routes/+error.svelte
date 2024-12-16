<script>
	import { page } from '$app/stores';
</script>

<main>
	{#if $page.status === 404}
		<h1 class="title">404</h1>
		<p>The requested page could not be found.</p>
	{:else}
		<h1>Oops!</h1>
		<p>Something went wrong. Let's try that again.</p>
	{/if}

	<button class="btn secondary">Return to the tool</button>
</main>

<style>
	main {
		background-color: var(--sky);
		padding: 3rem;
		height: 100vh;
		position: relative;
		box-sizing: border-box;
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
</style>
