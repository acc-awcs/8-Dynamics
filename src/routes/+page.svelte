<script lang="ts">
	import PromptWithSlider from '$lib/components/PromptWithSlider.svelte';
	import type { Section } from '$lib/types';

	let { data } = $props();

	const sections: Section[] = $state(
		data.dynamics.map(({ full: dynamic }, idx) => {
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

		// Focus the input in the given section once in view, preventing duplicate scrolling.
		// Unlike other browsers, Safari seems to assume focus-visible on a mouse link click,
		// so focusing to the section for Safari instead of the input to avoid triggering focus styles for mouse users.
		const elementIdToFocus = navigator.userAgent.includes('Safari') ? `section-${idx}` : key;
		document.getElementById(elementIdToFocus)?.focus({ preventScroll: true });
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
	<div class="clouds-overlay-wrapper">
		<div class="clouds-overlay"></div>
	</div>

	<section class="intro">
		<div>
			<h1>8 Dynamics of Climate Engagement</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis mi arcu, sed iaculis
				sapien sodales sit amet. Vestibulum magna urna, laoreet vitae ante et, lobortis laoreet
				justo. Aliquam erat volutpat. Quisque commodo, ex non bibendum commodo, nulla nisi posuere
				enim, ut hendrerit tellus tortor sed sem.
			</p>
			<a class="btn secondary" href="#section-0" onclick={(e) => scrollToSection(e, 0)}>Start</a>
		</div>
	</section>

	{#each sections as section, index}
		<!-- Allow focus jumping to section to avoid focus styles being applied to input on Safari link click -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<section id={`section-${index}`} tabindex={-1} bind:this={section.el}>
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
		overscroll-behavior: contain;
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
		outline: 0px;
	}
	section.intro {
		background-image: url('$lib/assets/cloud-hero-layer-1.jpg');
		background-size: cover;
	}
	section.intro > div {
		width: var(--width-large);
		text-align: center;
		max-width: 100%;
	}
	h1 {
		font-size: 44px;
		font-weight: 200;
		font-family: serif;
		color: var(--cream);
	}
	.intro p {
		text-align: center;
		font-family: sans-serif;
		font-size: 20px;
		font-weight: 300;
		line-height: 30px;
		color: var(--cream);
		margin-bottom: 40px;
	}
	.clouds-overlay-wrapper {
		background-size: cover;
		height: 100vh;
		position: absolute;
		width: 100%;
		z-index: 1;
	}
	.clouds-overlay {
		background-size: cover;
		background-image: url('$lib/assets/cloud-hero-layer-2.png');
		height: 100vh;
		position: absolute;
		width: 100%;
		z-index: 1;
	}
</style>
