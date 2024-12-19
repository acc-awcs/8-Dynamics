<script>
	// Free little ring loader from https://loading.io/css/
	export let style = '';
	export let absolute = false;
</script>

<div class="moving-ring" class:absolute {style}></div>

<style>
	.moving-ring {
		display: inline-block;
		width: 29px;
		height: 29px;
		margin-top: -10px;
	}
	.moving-ring:after {
		content: ' ';
		display: block;
		width: 29px;
		height: 29px;
		margin: 0px;
		position: relative;
		top: 6px;
		border-radius: 50%;
		border: 4px solid var(--cream);
		border-color: var(--cream) transparent var(--cream) transparent;
		box-sizing: border-box;
		animation: moving-ring 1.2s linear infinite;
	}
	.moving-ring.absolute {
		position: absolute;
		top: 6px;
		left: 38%;
		left: calc(50% - 15px);
	}
	@keyframes moving-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
