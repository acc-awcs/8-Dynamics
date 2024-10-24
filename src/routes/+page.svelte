<script lang="ts">
	import { goto } from '$app/navigation';
	export let data;

	let form: HTMLFormElement;
	interface Section {
		key: string;
		dynamic: string;
		el: HTMLElement | undefined;
		value: number;
	}

	const sections: Section[] = data.dynamics.map((dynamic, idx) => {
		return {
			key: 'ABCDEFGH'[idx],
			dynamic,
			el: undefined,
			value: 3
		};
	});

	function scrollToSection(idx: number) {
		const { el, key } = sections[idx];
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth'
		});
		document.getElementById(key)?.focus();
	}

	function formSubmit(evt: SubmitEvent) {
		evt.preventDefault();
		if (!form) return;
		const formData = new FormData(form);
		let resultString = '';
		for (const [letter, number] of formData.entries()) {
			resultString += `${letter}${number}`;
		}
		goto(`/results/${resultString}`);
	}
</script>

<svelte:head>
	<title>8 Dynamics | All We Can Save</title>
	<meta name="description" content="About this app" />
</svelte:head>

<main>
	<section>
		<h1>8 Dynamics of Climate Engagement</h1>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis mi arcu, sed iaculis
			sapien sodales sit amet. Vestibulum magna urna, laoreet vitae ante et, lobortis laoreet justo.
			Aliquam erat volutpat. Quisque commodo, ex non bibendum commodo, nulla nisi posuere enim, ut
			hendrerit tellus tortor sed sem. Maecenas sollicitudin tortor et orci porta pharetra. Sed eget
			nisi facilisis, ultricies tortor et, accumsan mi. Aenean lobortis et odio vitae mollis. Nullam
			porttitor, magna ut feugiat suscipit, massa enim congue quam, ultricies tincidunt velit mauris
			a dui. Pellentesque accumsan felis pellentesque, tempus odio at, venenatis nulla.
		</p>
		<button on:click={() => scrollToSection(0)}>Start</button>
	</section>
	<form on:submit={formSubmit} bind:this={form}>
		{#each sections as section, index}
			<!-- TODO: make this a component -->
			<section bind:this={section.el}>
				<label for={section.key}>{index + 1}. {section.dynamic}</label>
				<input
					name={section.key}
					id={section.key}
					type="range"
					min="1"
					max="5"
					bind:value={section.value}
				/>
				<div class="buttons">
					{#if index > 0}
						<button type="button" on:click={() => scrollToSection(index - 1)}>Previous</button>
					{/if}
					{#if index === sections.length - 1}
						<button type="submit">Finish</button>
					{:else}
						<button type="button" on:click={() => scrollToSection(index + 1)}>Next</button>
					{/if}
				</div>
			</section>
		{/each}
	</form>
</main>

<style>
	main {
		overflow: scroll;
		height: 100vh;
		scroll-snap-type: y mandatory;
		scroll-behavior: smooth;
	}
	section {
		height: 100vh;
		scroll-snap-align: start;
		scroll-padding: 2em;
	}
	label {
		display: block;
	}
</style>
