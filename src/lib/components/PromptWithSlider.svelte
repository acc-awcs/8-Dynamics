<script lang="ts">
	import type { Section } from '$lib/types';

	export let value: number;
	export let section: Section;
	export let index: number;
	export let handleSectionChange: (evt: Event, idx: number) => void;
	export let resultsLink: string | null; // Only used for final section
</script>

<div class="wrapper">
	<label for={section.key}>{section.dynamic}</label>

	<div class="input-wrapper">
		<!-- hiding the displayed value and min/max numbers for screenreader, as those are accessible via the input element itself -->
		<div aria-hidden="true" class="value">{value}</div>
		<div class="slider">
			<span aria-hidden="true">1</span>
			<input
				bind:value={section.value}
				name={section.key}
				id={section.key}
				type="range"
				min="1"
				max="5"
				aria-valuemin="1"
				aria-valuemax="5"
				aria-valuenow={value}
			/>
			<span aria-hidden="true">5</span>
		</div>
		<!-- supplementing min/max descriptions with associated numbers for screen reader -->
		<div class="descriptions">
			<div><span class="visually-hidden">1 = </span>not true for me</div>
			<div><span class="visually-hidden">5 = </span>extremely true for me</div>
		</div>
	</div>

	<div class="prev-next">
		{#if !resultsLink}
			<a
				class="btn secondary"
				href={`#section-${index + 1}`}
				onclick={(e) => handleSectionChange(e, index + 1)}
			>
				Next
			</a>
		{/if}
	</div>

	{#if resultsLink}
		<div class="finish">
			<a class="btn secondary" href={resultsLink}>Finish</a>
		</div>
	{/if}
</div>

<style>
	.wrapper {
		max-width: 100%;
		width: var(--width-small);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	label {
		display: block;
		font-family: 'adobe-garamond-pro', serif;
		font-weight: 400;
		font-size: 26px;
		font-style: italic;
		outline: none;
		text-align: center;
	}

	.input-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin: 1.5rem 0;
	}

	.value {
		font-size: 44px;
		text-align: center;
		font-weight: 600;
		color: var(--mustard);
	}

	.slider {
		display: flex;
		align-items: center;
		padding: 10px 16px;
		margin: -14px -20px;
		border-radius: 28px;
		transition: border 0.2s linear;
		box-sizing: border-box;
		font-size: 24px;
		font-weight: 600;
	}

	.descriptions {
		display: flex;
		justify-content: space-between;
		font-size: 16px;
		font-weight: 600;
		line-height: 1.6;
	}

	.prev-next {
		width: 100%;
		display: flex;
		gap: 10px;
		justify-content: center;
	}

	.finish {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 2rem;
	}

	input[type='range'] {
		appearance: none;
		-webkit-appearance: none;
		width: 100%;
		background: transparent;
		margin: 0px 1rem;
		height: 1px;
		display: flex;
		background: var(--charcoal);
		cursor: pointer;
	}

	.slider:has(:focus-visible) {
		border: 4px solid var(--mustard);
	}

	input[type='range']:focus {
		outline: none;
	}

	/* Chrome, Safari, Opera, Edge */
	input[type='range' i]::-webkit-slider-thumb {
		height: 30px;
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: var(--mustard);
		-webkit-appearance: none;
		appearance: none;
	}

	/* Firefox */
	input[type='range']::-moz-range-thumb {
		height: 25px;
		width: 25px;
		background: none;
		border-radius: 50%;
		background-color: var(--mustard);
		-moz-appearance: none;
		appearance: none;
	}
</style>
