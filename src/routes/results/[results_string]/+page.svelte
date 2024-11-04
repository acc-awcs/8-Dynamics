<script lang="ts">
	import SpiderChart from '$lib/components/SpiderChart.svelte';

	export let data;
</script>

<h1>Your Results</h1>
<div id="container" style="position: relative; padding: 160px">
	<SpiderChart answers={data.object} features={Object.keys(data.object)} />
</div>
