<script lang="ts">
	import PromptWithSlider from '$lib/components/PromptWithSlider.svelte';
	import type { Section } from '$lib/types';

	let { data } = $props();

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
	<section class="intro">
		<div>
			<h1>8 Dynamics of Climate Engagement</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis mi arcu, sed iaculis
				sapien sodales sit amet. Vestibulum magna urna, laoreet vitae ante et, lobortis laoreet
				justo. Aliquam erat volutpat. Quisque commodo, ex non bibendum commodo, nulla nisi posuere
				enim, ut hendrerit tellus tortor sed sem. Maecenas sollicitudin tortor et orci porta
				pharetra. Sed eget nisi facilisis, ultricies tortor et, accumsan mi. Aenean lobortis et odio
				vitae mollis. Nullam porttitor, magna ut feugiat suscipit, massa enim congue quam, ultricies
				tincidunt velit mauris a dui. Pellentesque accumsan felis pellentesque, tempus odio at,
				venenatis nulla.
			</p>
			<a class="btn primary" href="#section-0" onclick={(e) => scrollToSection(e, 0)}>Start</a>
		</div>
	</section>

	{#each sections as section, index}
		<section id={`section-${index}`} bind:this={section.el}>
			<PromptWithSlider
				bind:value={section.value}
				{section}
				{index}
				handleSectionChange={scrollToSection}
				resultsLink={index === sections.length - 1 ? resultsLink : null}
			/>
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
		padding: 2rem;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		scroll-snap-align: start;
		scroll-padding: 2em;
	}
	section.intro {
		background-color: var(--sky);
	}
	section.intro > div {
		width: var(--width-large);
		text-align: center;
		max-width: 100%;
	}
	.intro p {
		text-align: left;
		padding: 1rem 0px;
	}
</style>
