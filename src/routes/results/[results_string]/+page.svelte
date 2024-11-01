<script lang="ts">
	import * as d3 from 'd3';
	import { tick } from 'svelte';

	export let data;
	let answers = [{ A: 1, B: 4, C: 3, D: 2, E: 5, F: 1, G: 2, H: 4 }];
	const config = {
		d: 500, // diameter of chart
		px: 20, // padding horizontal each side
		py: 20, // padding vertical each side
		answerR: 18, // answer circle radius, should not be more than padding
		features: Object.keys(answers[0]),
		ticks: [1, 2, 3, 4, 5]
		// minAnswer: 1,
		// maxAnswer: 5,
	};

	let radialScale = d3
		.scaleLinear()
		.domain([0, 5])
		.range([0, config.d / 2]);

	// // let svg = d3
	// // 	.select('#chart')
	// // 	.attr('width', config.d + 2 * config.px)
	// // 	.attr('height', config.d + 2 * config.py);
	// console.log({ svg });
	function angleToCoordinate(angle: number, value: number) {
		let x = Math.cos(angle) * radialScale(value);
		let y = Math.sin(angle) * radialScale(value);
		return { x: config.px + (config.d / 2 + x), y: config.py + (config.d / 2 - y) };
	}

	// // Method for drawing non-circle tick mark
	function tickToPolygon(tick: number) {
		const numbers = config.features
			.map((f, i) => {
				let angle = Math.PI / 2 + (2 * Math.PI * i) / config.features.length;
				console.log({ angle });
				return angleToCoordinate(angle, tick);
			})
			.reduce((prev, curr) => {
				return `${prev} ${curr.x} ${curr.y}`;
			}, '')
			.trim();
		return numbers;
	}

	function featureLine(featureIdx: number) {
		let pct = featureIdx / config.features.length;
		let angle = Math.PI / 2 + 2 * Math.PI * pct;

		return angleToCoordinate(angle, 5);
	}

	// // svg
	// // 	.selectAll('polygon')
	// // 	.data(config.ticks)
	// // 	.join((enter) =>
	// // 		enter
	// // 			.append('polygon')
	// // 			.attr('points', (d) => tickToPolygon(d))
	// // 			.attr('fill', 'none')
	// // 			.attr('stroke', 'black')
	// 	);
</script>

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
	</svg>
</div>

<h1>Your Results!</h1>
<!-- <ul>
	{#each data.answers as answer}
		<li>{answer.key}: {answer.value}</li>
	{/each}
</ul> -->
