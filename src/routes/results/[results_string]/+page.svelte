<script lang="ts">
	import DynamicSlider from '$lib/components/DynamicSlider.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import SpiderChart from '$lib/components/SpiderChart.svelte';
	import { _sendEmail } from './+page';
	import { rotateDynamic } from '$lib/dynamics';
	import { onDestroy, onMount } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ButtonLoader from '$lib/components/ButtonLoader.svelte';

	const INTERVAL = 1500;
	const BREAKPOINT = 900;
	let innerWidth = $state(500);
	let { data } = $props();
	let highlight = $state(0);
	let intervalId = $state<number>();
	let chartWidth = $state(500);

	// Email form & query state management
	let email = $state('');
	let showEmailModal = $state<boolean>(false);
	let sendEmailLoading = $state<boolean>(false);
	let sendEmailFinished = $state<boolean>(false);
	let sendEmailSuccess = $state<boolean>(false);
	let emailError = $state<string>('');

	function startRotate() {
		if (innerWidth < BREAKPOINT) {
			// If the screen is mobile width, we don't want to automatically highlight the dynamics
			return;
		}
		if (!intervalId) {
			intervalId = setInterval(() => {
				highlight = rotateDynamic(highlight, 1);
			}, INTERVAL);
		}
	}
	function stopRotate() {
		clearInterval(intervalId);
		intervalId = undefined;
	}

	function onHover(select: number) {
		highlight = select;
		stopRotate();
	}

	onMount(() => {
		startRotate();
	});
	onDestroy(() => {
		stopRotate();
	});

	function handleEmailChange(evt: Event): void {
		const input = evt.target as HTMLInputElement;
		email = input.value;
	}

	function openModal(): void {
		showEmailModal = true;
	}

	function closeModal(): void {
		email = '';
		emailError = '';
		sendEmailFinished = false;
		showEmailModal = false;
	}
</script>

<svelte:window bind:innerWidth />

{#if showEmailModal}
	<Modal handleClose={closeModal}>
		{#if !sendEmailFinished}
			<!-- Email form -->
			<h1 class="title modal-title">Email your results</h1>
			<p>Email yourself a link to this page so you can reference your results later.</p>
			{#if emailError.length > 0}
				<p class="error">{emailError}</p>
			{/if}
			<form
				onsubmit={async (e) => {
					if (email === '') {
						emailError = 'Please enter an email address';
					} else if (!sendEmailLoading) {
						sendEmailLoading = true;
						const resp = await _sendEmail(email, data.results_string);
						sendEmailLoading = false;
						if (resp.invalidFormat) {
							emailError = 'Please enter a valid email';
						} else {
							sendEmailFinished = true;
							sendEmailSuccess = resp.success;
							email = '';
						}
					}
				}}
			>
				<label class="visually-hidden" for="email">Your email address</label>
				<input
					value={email}
					type="text"
					oninput={handleEmailChange}
					placeholder="Your email address"
					id="email"
				/>
				<div class="buttons">
					<button class="btn secondary" type="button" onclick={() => (showEmailModal = false)}
						>Cancel</button
					>
					<button class="btn primary" class:loading={sendEmailLoading} type="submit">
						{#if sendEmailLoading}
							<ButtonLoader />
						{:else}
							Send
						{/if}
					</button>
				</div>
			</form>
		{:else if sendEmailSuccess === true}
			<!-- Success message -->
			<h1 class="title">Email sent</h1>
			<p>Your email is on its way! Check your inbox for your results link.</p>
			<div class="buttons done">
				<button class="btn primary" onclick={closeModal}>Done</button>
			</div>
		{:else}
			<!-- Error message -->
			<h1 class="title">Oops!</h1>
			<p>
				Looks like something went wrong on our end and we couldn't send your email. Please try again
				later.
			</p>
			<div class="buttons done">
				<button class="btn primary" onclick={closeModal}>Done</button>
			</div>
		{/if}
	</Modal>
{/if}

<div class="outer">
	<header class="logo">
		<Logo />
	</header>
	<main>
		<div class="intro fade-in">
			<a href="/">← Retake the Quiz</a>
			<h1 class="title">Your Results</h1>
		</div>
		<div class="chart fade-in delayed" aria-hidden="true" bind:clientWidth={chartWidth}>
			<SpiderChart answers={data.object} {highlight} {chartWidth} {onHover} onLeave={startRotate} />
		</div>
		<div class="results fade-in">
			<DynamicSlider
				{highlight}
				answers={data.answers.map((a) => a.value)}
				{onHover}
				onLeave={startRotate}
			/>

			<div class="next-steps">
				<h2>Take a moment to pause and reflect.</h2>
				<p>If you have a notebook on hand, jot down your responses.</p>
				<ul>
					<li>Looking at your results, what insights arise for you?</li>
					<li>
						Given what feels wobbly and what feels strong, pick one dynamic that might support your
						own deep, sustained, and courageous climate engagement. How could you invest in it with
						intention? What support do you need?
					</li>
				</ul>
				<div class="actions">
					<button class="btn secondary" onclick={openModal}>Email Your Results</button>
					<a href="https://www.allwecansave.earth/dynamics-resources" class="btn secondary"
						>Resources for Support</a
					>
				</div>
			</div>
		</div>
	</main>
	<footer>
		© 2024 The All We Can Save Project. Developers <a
			href="https://github.com/chelshaw"
			target="_blank"
			rel="noopener nofollow">Chelsea Shaw</a
		>,
		<a href="https://github.com/emikjackson" target="_blank" rel="noopener nofollow">Emi Jackson</a
		>, and
		<a href="https://www.linkedin.com/in/li-helen" target="_blank" rel="noopener nofollow"
			>Helen Li</a
		> brought this interactive tool to life.
	</footer>
</div>

<style>
	.intro a {
		color: var(--charcoal);
		font-weight: 300;
		text-decoration: none;
		font-style: normal;
		z-index: 1;
	}
	.intro a:hover,
	.intro a:active,
	.intro a:focus {
		font-weight: 500;
	}
	.outer {
		background-color: var(--sky);
		min-height: 100vh;
		background-image: url('$lib/assets/cloud-1.png'), url('$lib/assets/cloud-4.png'),
			url('$lib/assets/cloud-5.png');
		background-repeat: no-repeat, no-repeat, no-repeat;
		background-blend-mode: overlay, overlay, overlay;
		background-position:
			bottom left,
			bottom 0 right -100px,
			bottom right;
		background-size: 485px, 504px, 503px;
		box-sizing: border-box;
	}
	main {
		position: relative;
		padding: 1rem;
		grid-template-columns: 1fr minmax(400px, 1fr);
		grid-template-rows: min-content 1fr;
		gap: 1em 3em;
	}
	.logo {
		height: 120px;
		position: relative;
	}
	.intro {
		margin: 0px 20px;
		margin-top: 20px;
	}
	.chart {
		grid-column-start: 2;
		grid-column-end: span 1;
		grid-row-start: 1;
		grid-row-end: span 2;
		margin-top: 40px;
	}
	h1 {
		margin: 0;
		padding: 0;
		margin-top: 30px;
		margin-bottom: 40px;
	}
	h2 {
		font-family: 'adobe-garamond-pro', serif;
		font-weight: 400;
		font-size: 26px;
		line-height: 1.4;
		margin: 0;
	}
	.actions {
		margin-top: 1.2em;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.5em;
	}
	ul {
		padding-inline-start: 20px;
	}
	.next-steps {
		border: 1px solid var(--charcoal);
		border-radius: 10px;
		background-color: var(--cream);
		padding: 30px;
		margin-top: 2em;
	}
	.next-steps p {
		font-weight: 600;
		font-size: 16px;
	}
	.next-steps li {
		font-size: 15px;
		line-height: 1.6;
	}
	footer {
		text-align: center;
		padding: 2em 3em 4em;
		font-family: 'adobe-garamond-pro', serif;
		font-weight: 400;
		font-size: 18px;
		font-style: italic;
		color: var(--charcoal);
	}
	footer > a {
		color: inherit;
	}

	input {
		padding: 16px 30px;
		padding-bottom: 19px;
		font-size: 18px;
		font-family: 'General Grotesque', Helvetica, Arial, sans-serif;
		font-weight: 300;
		border: 1px solid rgba(0, 0, 0, 0.12);
		transition: outline 0.2s linear;
		width: 100%;
		box-sizing: border-box;
	}
	input:focus {
		outline: 4px solid var(--mustard);
	}
	.buttons {
		width: 100%;
		margin-top: 20px;
		display: flex;
		justify-content: center;
		gap: 20px;
	}

	.buttons .btn {
		width: 100%;
	}

	.buttons.done .btn {
		margin-top: 10px;
		width: 70%;
	}

	.error {
		color: var(--rust);
	}

	.modal-title {
		margin-bottom: 20px;
	}

	.fade-in {
		transition: all 2s linear;
		opacity: 0;
		transform: translateY(20px);
		animation: fadeIn 2s ease 0s 1 forwards;
	}

	.delayed {
		animation-delay: 0.5s;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}

		100% {
			opacity: 1;
			transform: translateY(0px);
		}
	}

	@media screen and (min-width: 900px) {
		main {
			display: grid;
			padding: 25px 3rem;
		}
		.actions {
			flex-wrap: nowrap;
			justify-content: flex-start;
		}
		h1 {
			margin-bottom: 0px;
		}
		.intro {
			margin: 0px;
		}
	}

	@media screen and (max-width: 400px) {
		main {
			padding: 10px;
		}
	}
</style>
