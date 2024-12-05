<script lang="ts">
	import SpiderChart from '$lib/components/SpiderChart.svelte';

	export let data;
</script>

<h1 class="title">Your Results</h1>
<main>
	<SpiderChart answers={data.object} />
</main>
