<script lang="ts">
	import PromptWithSlider from '$lib/components/PromptWithSlider.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import type { Section } from '$lib/types';
	import { onMount } from 'svelte';
	import illustrations from '$lib/illustrations';

	let { data } = $props();

	// Cloud parallax variables
	let scrollY = $state(0);
	let innerWidth = $state(0);
	let innerHeight = $state(0);
	const OVERLAY_OFFSET_LEFT_PERCENT = 5;
	const OVERLAY_OFFSET_BOTTOM_PERCENT = 4;

	// The cloud overlay has additional width/height on the left and bottom.
	// As the user scrolls, we translate the overlay to move towards these initially hidden edges.
	let percentMoved = $derived(Math.min(scrollY / innerHeight, 1));
	let translateX = $derived(percentMoved * ((OVERLAY_OFFSET_LEFT_PERCENT / 100) * innerWidth));
	let translateY = $derived(percentMoved * (-(OVERLAY_OFFSET_BOTTOM_PERCENT / 100) * innerHeight));

	let sectionRefs: HTMLElement[] = [];

	const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
		entries.forEach((entry) => {
			const section = entry.target as HTMLElement;

			// Select all images within the current section
			const images = section.querySelectorAll<HTMLImageElement>('img');

			if (entry.isIntersecting) {
				// Show images
				images.forEach((image) => {
					image.classList.add('visible');
				});
			} else {
				// Hide images
				images.forEach((image) => {
					image.classList.remove('visible');
				});
			}
		});
	};

	onMount(() => {
		const observer = new IntersectionObserver(intersectionCallback, {
			threshold: 0.1 // Trigger when 10% of the section is visible
		});

		sectionRefs.forEach((section) => observer.observe(section));

		return () => {
			sectionRefs.forEach((section) => observer.unobserve(section));
		};
	});

	let storeSection = (el: HTMLElement) => {
		if (el && !sectionRefs.includes(el)) {
			sectionRefs.push(el);
		}
	};

	const sections: Section[] = $state(
		data.dynamics.map(({ full: dynamic }, idx) => {
			return {
				key: 'ABCDEFGH'[idx],
				dynamic,
				el: undefined,
				value: 3,
				bgImages: illustrations[idx]
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

<svelte:window bind:innerWidth bind:innerHeight />

<main onscroll={(e) => (scrollY = (e.target as HTMLElement)?.scrollTop)}>
	<Logo onDark={true} />
	<section class="intro">
		<div class="clouds-overlay-wrapper">
			<div
				class="clouds-overlay"
				style="
					transform: translate({translateX}px, {translateY}px); 
					height: {100 + OVERLAY_OFFSET_BOTTOM_PERCENT}vh; 
					bottom: {-OVERLAY_OFFSET_BOTTOM_PERCENT}vh;
					width: {100 + OVERLAY_OFFSET_LEFT_PERCENT}%;
					left: {-OVERLAY_OFFSET_LEFT_PERCENT}%;
					"
			></div>
		</div>
		<div class="content">
			<h1 class="title">8 Dynamics of Climate Engagement</h1>
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
		<section id={`section-${index}`} tabindex={-1} bind:this={section.el} use:storeSection>
			<div class="illustrations-wrapper">
				{#if section.bgImages.left}
					<img src={section.bgImages.left} class={`hero-${index}-left`} alt="" />
				{/if}
				{#if section.bgImages.right}
					<img src={section.bgImages.right} class={`hero-${index}-right`} alt="" />
				{/if}
			</div>
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
		position: relative;
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
		color: var(--cream);
	}
	section.intro .content {
		width: var(--width-large);
		text-align: center;
		max-width: 100%;
		position: relative;
		z-index: 2;
	}
	.intro p {
		text-align: center;
		font-family: sans-serif;
		font-size: 20px;
		font-weight: 300;
		line-height: 1.5;
		margin-bottom: 40px;
	}
	.clouds-overlay-wrapper {
		height: 100vh;
		width: 100%;
		z-index: 1;
		position: absolute;
		overflow: hidden;
	}
	.clouds-overlay {
		background-size: 80%, 100%;
		background-image: url('$lib/assets/cloud-hero-layer-2-top.png'),
			url('$lib/assets/cloud-hero-layer-2-bottom.png');
		background-position:
			top right,
			bottom center;
		background-repeat: no-repeat, no-repeat;
		position: absolute;
		transition: transform 0.1s linear;
	}
	.illustrations-wrapper {
		height: 100vh;
		width: 100%;
		z-index: -2;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
	}
	.hero-0-left,
	.hero-1-left,
	.hero-2-left,
	.hero-3-left,
	.hero-4-left,
	.hero-5-left,
	.hero-6-left,
	.hero-7-left {
		position: fixed;
		left: 0;
	}
	.hero-0-right,
	.hero-1-right,
	.hero-2-right,
	.hero-3-right,
	.hero-4-right,
	.hero-5-right,
	.hero-6-right,
	.hero-7-right {
		position: fixed;
		right: 0;
	}
	/* preventing the images from getting cropped on the bottom*/
	.hero-0-right,
	.hero-3-right,
	.hero-4-left {
		bottom: 0;
	}
	img.visible {
		opacity: 1;
	}
	@media (max-width: 850px) {
		/* reducing the opacing when the images overlap with the section text
		for better readability */
		img.visible {
			opacity: 0.5;
		}
		/* ensure top clouds don't overlap with logo */
		.clouds-overlay {
			background-size: 120%, 100%;
			background-position:
				top left 200px,
				bottom center;
		}
	}
	img {
		opacity: 0;
		transition:
			opacity 0.6s ease,
			transform 0.6s ease;
		transform: translateY(20px);
	}
</style>
