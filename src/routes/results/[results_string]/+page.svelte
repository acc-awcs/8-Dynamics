<script lang="ts">
	export let data;
</script>

<h1>Your Results!</h1>
<ul>
	{#each data.answers as answer}
		<li>{answer.key}: {answer.value}</li>
	{/each}
</ul>
<p></p>
