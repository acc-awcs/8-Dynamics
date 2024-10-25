<script lang="ts">
	let { data } = $props();

	interface Section {
		key: string;
		dynamic: string;
		el: HTMLElement | undefined;
		value: number;
	}

	const sections: Section[] = $state(
		data.dynamics.map((dynamic, idx) => {
			return {
				key: 'ABCDEFGH'[idx],
				dynamic,
				el: undefined,
				value: 3
			};
		})
	);

	function scrollToSection(evt: Event, idx: number) {
		// supercedes the default a tag link for smooth scrolling if javascript is enabled
		evt.preventDefault();
		const { el, key } = sections[idx];
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth'
		});
		// focus the input in the given section once in view
		document.getElementById(key)?.focus();
	}

	const resultsLink = $derived.by(() => {
		let link = '/results/';
		for (const s of sections) {
			link += `${s.key}${s.value}`;
		}
		return link;
	});
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
		<a href="#section-0" onclick={(e) => scrollToSection(e, 0)}>Start</a>
	</section>

	{#each sections as section, index}
		<!-- TODO: make this a component -->
		<section id={`section-${index}`} bind:this={section.el}>
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
					<a href={`#section-${index - 1}`} onclick={(e) => scrollToSection(e, index - 1)}>
						Previous
					</a>
				{/if}
				{#if index === sections.length - 1}
					<a href={resultsLink}>Finish</a>
				{:else}
					<a href={`#section-${index + 1}`} onclick={(e) => scrollToSection(e, index + 1)}>
						Next
					</a>
				{/if}
			</div>
		</section>
	{/each}
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
