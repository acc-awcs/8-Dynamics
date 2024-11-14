<script lang="ts">
	import dynamics from '$lib/dynamics';
	import { line, scaleLinear } from 'd3';
	let { answers }: { answers: Record<string, number> } = $props();

	const BREAKPOINT = 800;
	const features = $derived(Object.keys(answers));
	let innerWidth = $state(500);
	const config = $derived({
		d: innerWidth > BREAKPOINT ? 500 : innerWidth - 240, // diameter of chart
		p: 20, // padding each side to allow answer circles to render in svg container
		labelD: innerWidth > BREAKPOINT ? 160 : 120, // dynamics label text diameter
		ticks: [1, 2, 3, 4, 5]
	});

	let radialScale = $derived(
		scaleLinear()
			.domain([0, 5])
			.range([0, config.d / 2])
	);

	let lineHelper = line()
		.x((d: [number, number]) => d[0])
		.y((d: [number, number]) => d[1]);

	// given the precise angle in radians and value (1-5),
	// returns {x, y} coordinate with padding accounted for
	function angleToCoordinate(angle: number, value: number) {
		// multiplying by -1 makes the math count clockwise
		let x = Math.cos(angle) * radialScale(value) * -1;
		let y = Math.sin(angle) * radialScale(value);
		return { x: config.p + (config.d / 2 + x), y: config.p + (config.d / 2 - y) };
	}

	// Method for drawing non-circle tick mark
	// `tick` maps to range values 1-5 per question
	// `tickToPolygon` draws the concentric octagons
	function tickToPolygon(tick: number) {
		const numbers = features
			.map((f, i) => {
				let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
				return angleToCoordinate(angle, tick);
			})
			.reduce((prev, curr) => {
				return `${prev} ${curr.x} ${curr.y}`;
			}, '')
			.trim();
		return numbers;
	}

	// `radialTickLines` calculates the lines from center of the octagons to create the web
	function radialTickLines() {
		let lines: { outerX: number; outerY: number }[] = [];
		for (var i = 0; i < features.length; i++) {
			let pct = i / features.length;
			let angle = Math.PI / 2 + 2 * Math.PI * pct;
			const { x, y } = angleToCoordinate(angle, 5);
			lines.push({
				outerX: x,
				outerY: y
			});
		}
		return lines;
	}

	function drawAnswerShape(answers: Record<string, number>): string | null {
		let coordinates: [number, number][] = [];
		for (var i = 0; i < features.length; i++) {
			let ft_name = features[i];
			let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
			let { x, y } = angleToCoordinate(angle, answers[ft_name]);
			coordinates.push([x, y]);
		}
		return lineHelper(coordinates);
	}

	// draws circles for score labels
	function getCircleCoords({ answer, idx }: { answer: number; idx: number }) {
		let angle = Math.PI / 2 + (2 * Math.PI * idx) / features.length;
		return {
			...angleToCoordinate(angle, answer),
			answer
		};
	}
	const formattedAnswers = $derived(
		features.reduce(
			(
				resultArray: {
					feature: string;
					answer: number;
					xCoord: number;
					yCoord: number;
					idx: number;
				}[],
				feature,
				idx
			) => {
				const answer = answers[feature];
				const coords = getCircleCoords({ answer, idx });
				resultArray.push({ feature, answer, xCoord: coords.x, yCoord: coords.y, idx });
				return resultArray;
			},
			[]
		)
	);

	// calculates the offset of each label's centerpoint from the center of the chart
	let labels = $derived.by(() => {
		const numPoints = features.length;
		const points = [];
		const angleStep = (2 * Math.PI) / numPoints;
		// not using radialScale because we want a radius outside those bounds
		const radius = config.d / 2 + config.p + config.labelD / 2;

		for (let i = 0; i < numPoints; i++) {
			const angle = i * angleStep;
			const x = radius * Math.sin(angle);
			// multiply y by -1 so it maps clockwise
			const y = radius * Math.cos(angle) * -1;
			points.push({
				offsetX: x,
				offsetY: y,
				fullText: dynamics[i].full,
				shortText: dynamics[i].short
			});
		}
		return points;
	});

	let tooltip: HTMLDivElement;
	let hidden: HTMLDivElement;

	function mouseOver(description: string) {
		tooltip = document.createElement('div');
		tooltip.textContent = description;
		tooltip.style.backgroundColor = 'var(--cream)';
		tooltip.style.padding = '8px';
		tooltip.style.color = 'var(--moss)';
		tooltip.style.border = '1px solid var(--moss)';
		tooltip.style.maxWidth = '200px';
		document.body.appendChild(tooltip);
	}

	function mouseMove(event: MouseEvent) {
		tooltip.style.position = 'absolute';
		tooltip.style.left = `${event.pageX + 10}px`;
		tooltip.style.top = `${event.pageY + 10}px`;
	}

	function focus(description: string) {
		hidden = document.createElement('div');
		hidden.textContent = description;
		hidden.style.display = 'none';
		document.body.appendChild(hidden);
	}

	function removeDescription(el: HTMLDivElement) {
		el.remove();
	}
</script>

<svelte:window bind:innerWidth />
<div class="outer" style={`padding: ${config.labelD}px;`}>
	<svg id="chart" width={config.d + 2 * config.p} height={config.d + 2 * config.p}>
		<g id="ticks">
			{#each config.ticks as tick}
				<!-- concentric octogons -->
				<polygon points={tickToPolygon(tick)} />
			{/each}
			{#each radialTickLines() as f}
				<line
					x1={config.p + config.d / 2}
					y1={config.p + config.d / 2}
					x2={f.outerX}
					y2={f.outerY}
				/>
			{/each}
		</g>
		<g id="answer">
			<path stroke-width="3" opacity="0.8" d={drawAnswerShape(answers)} />
			{#each formattedAnswers as ans}
				<circle cx={ans.xCoord} cy={ans.yCoord} r={config.p}></circle>
				<text x={ans.xCoord - 5} y={ans.yCoord + 3}>{ans.answer}</text>
			{/each}
		</g>
	</svg>
	<div class="labels-container" style={`width: ${config.labelD}px; height: ${config.labelD}px;`}>
		{#each labels as label, idx}
			<div
				class="dynamic"
				style={`width: ${config.labelD}px; height: ${config.labelD}px; transform: translate(${label.offsetX}px, ${label.offsetY}px)`}
			>
				{#if innerWidth >= BREAKPOINT}
					{label.fullText}
				{:else}
					<div
						onmouseover={() => mouseOver(label.fullText)}
						onmousemove={mouseMove}
						onmouseout={() => removeDescription(tooltip)}
						onfocus={() => focus(label.fullText)}
						onblur={() => removeDescription(hidden)}
						role="button"
						tabindex={idx + 2}
						class="truncated-label"
					>
						{label.shortText}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.outer {
		position: relative;
		background-color: var(--cream);
	}
	svg {
		display: block;
		margin: 0 auto;
	}

	/* TICKS SHAPES */
	#ticks line,
	#ticks polygon {
		fill: none;
		stroke: var(--charcoal);
	}

	/* ANSWER SHAPES */
	#answer path {
		fill: var(--moss);
		stroke: var(--moss);
	}
	#answer circle {
		fill: var(--moss);
	}
	#answer text {
		fill: var(--cream);
	}

	/* LABELS */
	.labels-container {
		position: absolute;
		display: block;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transform-origin: center;
	}
	.dynamic {
		position: absolute;
		border-radius: 50%;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		box-sizing: border-box;
		color: var(--charcoal);
		cursor: default;
	}
	.truncated-label {
		display: box;
		box-orient: vertical;
		line-clamp: 3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.truncated-label:focus {
		outline: none;
		border: 2px solid var(--mustard);
		border-radius: 10px;
	}
</style>
