<script lang="ts">
	import { onMount } from 'svelte';

	let ready: boolean = false;
	onMount(() => (ready = true));
</script>

<nav>
	<a href="/">home</a>
	<a href="/login">login</a>
	<a href="/signup">signup</a>

	<form action="/?/logout" method="POST">
		<button type="submit">logout</button>
	</form>
</nav>

{#if ready}
	<slot />
{/if}

<style lang="scss">
	:global(html, body) {
		background: linear-gradient(rgb(44, 45, 60) 0%, rgb(25, 26, 35) 50%);
		font-family: sans-serif;
		color: #fff;
		margin: 0;
		padding: 0;
		min-height: 100vh;
	}

	nav {
		display: flex;
		flex-direction: row;
		gap: 10px;
		position: fixed;
		top: 10px;
		left: 10px;
		z-index: 1000;

		a {
			color: #fff;
		}
	}
</style>
