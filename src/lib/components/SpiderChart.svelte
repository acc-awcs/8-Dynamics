<script lang="ts">
	import dynamics from '$lib/dynamics';
	import { line, scaleLinear } from 'd3';
	let { answers, features }: { answers: Record<string, number>; features: string[] } = $props();

	const config = {
		d: 500, // diameter of chart
		px: 20, // padding horizontal each side
		py: 20, // padding vertical each side
		answerR: 18, // answer circle radius, should not be more than padding
		labelD: 160, // label diameter
		ticks: [1, 2, 3, 4, 5]
	};

	let radialScale = scaleLinear()
		.domain([0, 5])
		.range([0, config.d / 2]);

	let lineHelper = line()
		.x((d: [number, number]) => d[0])
		.y((d: [number, number]) => d[1]);

	// given the precise angle in radians and value (1-5),
	// returns {x, y} coordinate with padding accounted for
	function angleToCoordinate(angle: number, value: number) {
		// multiplying by -1 makes the math count clockwise
		let x = Math.cos(angle) * radialScale(value) * -1;
		let y = Math.sin(angle) * radialScale(value);
		return { x: config.px + (config.d / 2 + x), y: config.py + (config.d / 2 - y) };
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

	// `featureLine` draws the lines from center of the octagons to create the web
	function featureLine(featureIdx: number) {
		let pct = featureIdx / features.length;
		let angle = Math.PI / 2 + 2 * Math.PI * pct;

		return angleToCoordinate(angle, 5);
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
	const formattedAnswers = features.reduce(
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
	);

	// calculates the offset of each label's centerpoint from the center of the chart
	let labels = $derived.by(() => {
		const numPoints = features.length;
		const points = [];
		const angleStep = (2 * Math.PI) / numPoints;
		// not using radialScale because we want a radius outside those bounds
		const radius = config.d / 2 + config.px + config.labelD / 2;

		for (let i = 0; i < numPoints; i++) {
			const angle = i * angleStep;
			const x = radius * Math.sin(angle);
			// multiply y by -1 so it maps clockwise
			const y = radius * Math.cos(angle) * -1;
			points.push({ offsetX: x, offsetY: y, text: dynamics[i] });
		}
		return points;
	});
</script>

<div class="outer">
	<svg id="chart" width={config.d + 2 * config.px} height={config.d + 2 * config.py}>
		{#each config.ticks as tick}
			<polygon fill="none" stroke="black" points={tickToPolygon(tick)} />
		{/each}
		{#each features as feature, idx}
			<line
				stroke="black"
				x1={config.px + config.d / 2}
				y1={config.py + config.d / 2}
				x2={featureLine(idx).x}
				y2={featureLine(idx).y}
			/>
		{/each}
		<g id="answer">
			<path stroke-width="3" opacity="0.8" d={drawAnswerShape(answers)} />
			{#each formattedAnswers as ans}
				<circle cx={ans.xCoord} cy={ans.yCoord} r={config.answerR}></circle>
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
				Dynamic {idx + 1}
				<br />
				{label.text}
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
		padding: 1rem;
		box-sizing: border-box;
		color: var(--charcoal);
	}
</style>
