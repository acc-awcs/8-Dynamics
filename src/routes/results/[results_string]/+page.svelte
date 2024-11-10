<script lang="ts">
	import dynamics from '$lib/dynamics';
	import { line, scaleLinear } from 'd3';
	import type { Action } from 'svelte/action';

	let { data } = $props();

	let answers = data.object;
	const config = {
		d: 500, // diameter of chart
		px: 20, // padding horizontal each side
		py: 20, // padding vertical each side
		answerR: 18, // answer circle radius, should not be more than padding
		features: Object.keys(answers),
		ticks: [1, 2, 3, 4, 5]
	};

	let radialScale = scaleLinear()
		.domain([0, 5])
		.range([0, config.d / 2]);

	let lineHelper = line()
		.x((d: [number, number]) => d[0])
		.y((d: [number, number]) => d[1]);

	// given the precise angle and value (1-5), returns {x, y} coordinate
	function angleToCoordinate(angle: number, value: number) {
		let x = Math.cos(angle) * radialScale(value);
		let y = Math.sin(angle) * radialScale(value);
		return { x: config.px + (config.d / 2 + x), y: config.py + (config.d / 2 - y) };
	}

	// Method for drawing non-circle tick mark
	// `tick` maps to range values 1-5 per question
	// `tickToPolygon` draws the concentric octagons
	function tickToPolygon(tick: number) {
		const numbers = config.features
			.map((f, i) => {
				let angle = Math.PI / 2 + (2 * Math.PI * i) / config.features.length;
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
		let pct = featureIdx / config.features.length;
		let angle = Math.PI / 2 + 2 * Math.PI * pct;

		return angleToCoordinate(angle, 5);
	}

	function drawAnswerShape(answers: Record<string, number>): string | null {
		let coordinates: [number, number][] = [];
		for (var i = 0; i < config.features.length; i++) {
			let ft_name = config.features[i];
			let angle = Math.PI / 2 + (2 * Math.PI * i) / config.features.length;
			let { x, y } = angleToCoordinate(angle, answers[ft_name]);
			coordinates.push([x, y]);
		}
		return lineHelper(coordinates);
	}

	// draws circles for score labels
	function getCircleCoords({ answer, idx }: { answer: number; idx: number }) {
		let angle = Math.PI / 2 + (2 * Math.PI * idx) / config.features.length;
		return {
			...angleToCoordinate(angle, answer),
			answer
		};
	}
	const formattedAnswers = config.features.reduce(
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

	const tooltipaction: Action<SVGCircleElement, { description: string }> = (
		element: SVGCircleElement,
		params: { description: string }
	) => {
		let tooltip: HTMLDivElement;

		$effect(() => {
			element.addEventListener('mouseover', () => {
				tooltip = document.createElement('div');
				tooltip.innerText = params.description;
				tooltip.style.position = 'absolute';
				tooltip.style.zIndex = '10';
				tooltip.style.backgroundColor = 'var(--cream)';
				tooltip.style.padding = '8px';
				tooltip.style.color = 'var(--moss)';
				tooltip.style.border = '1px solid var(--moss)';
				document.body.appendChild(tooltip);
			});

			element.addEventListener('mousemove', (evt) => {
				tooltip.style.left = `${evt.pageX + 10}px`;
				tooltip.style.top = `${evt.pageY + 10}px`;
			});

			element.addEventListener('mouseleave', () => {
				tooltip.remove();
			});

			return () => {
				tooltip.remove();
			};
		});
	};
</script>

<h1>Your Results</h1>
<div id="container" style="position: relative; padding: 160px">
	<svg
		id="chart"
		width={config.d + 2 * config.px}
		height={config.d + 2 * config.py}
		style="background: aliceblue; display: block; margin: 0 auto"
	>
		{#each config.ticks as tick}
			<polygon fill="none" stroke="black" points={tickToPolygon(tick)} />
		{/each}
		{#each config.features as feature, idx}
			<line
				stroke="black"
				x1={config.px + config.d / 2}
				y1={config.py + config.d / 2}
				x2={featureLine(idx).x}
				y2={featureLine(idx).y}
			/>
		{/each}
		<path stroke-width="3" stroke="navy" fill="navy" opacity="0.8" d={drawAnswerShape(answers)} />
		{#each formattedAnswers as ans}
			<circle
				cx={ans.xCoord}
				cy={ans.yCoord}
				fill="navy"
				r={config.answerR}
				use:tooltipaction={{ description: dynamics[ans.idx] }}
			/>
			<text x={ans.xCoord - 5} y={ans.yCoord + 3} fill="white">{ans.answer}</text>
		{/each}
	</svg>
</div>
