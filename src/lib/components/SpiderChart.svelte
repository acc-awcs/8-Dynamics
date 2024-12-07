<script lang="ts">
	import dynamics from '$lib/dynamics';
	import { line, scaleLinear } from 'd3';
	let { answers }: { answers: Record<string, number> } = $props();

	const BREAKPOINT = 800;
	const features = $derived(Object.keys(answers));
	let innerWidth = $state(500);
	const config = $derived({
		d: innerWidth > BREAKPOINT ? 500 : innerWidth - 240, // diameter of chart
		p: 40, // padding each side to allow answer circles to render in svg container
		labelD: 100, // dynamics label text diameter
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
		let lines: { outerX: number; outerY: number; labelX: number; labelY: number }[] = [];
		for (var i = 0; i < features.length; i++) {
			let pct = i / features.length;
			let angle = Math.PI / 2 + 2 * Math.PI * pct;
			const { x, y } = angleToCoordinate(angle, 5);
			const lCoord = angleToCoordinate(angle, 6);
			lines.push({
				outerX: x,
				outerY: y,
				labelX: lCoord.x,
				labelY: lCoord.y
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
</script>

<svelte:window bind:innerWidth />
<div class="outer" style={`padding: ${config.labelD}px;`}>
	<svg id="chart" width={config.d + 2 * config.p} height={config.d + 2 * config.p}>
		<path class="answer" stroke-width="3" opacity="0.8" d={drawAnswerShape(answers)} />
		<g id="ticks">
			{#each config.ticks as tick}
				<!-- concentric octogons -->
				<polygon points={tickToPolygon(tick)} />
			{/each}
			{#each radialTickLines() as f, idx}
				<line
					x1={config.p + config.d / 2}
					y1={config.p + config.d / 2}
					x2={f.outerX}
					y2={f.outerY}
				/>
				<line class="dash" x1={f.outerX} y1={f.outerY} x2={f.labelX} y2={f.labelY} />
			{/each}
		</g>
		<g id="answer">
			{#each formattedAnswers as ans}
				<circle cx={ans.xCoord} cy={ans.yCoord} r="13"></circle>
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
				{label.shortText}
			</div>
		{/each}
	</div>
</div>

<style>
	.outer {
		position: relative;
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
	line.dash {
		stroke-dasharray: 1px;
	}

	/* ANSWER SHAPES */
	path.answer {
		fill: var(--cream);
	}
	#answer circle {
		fill: var(--mustard);
	}
	#answer text {
		fill: var(--charcoal);
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
	}
</style>
