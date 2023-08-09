<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	<h3>
		{#if data.session}
			You are logged in!
		{:else}
			You are not logged in
		{/if}
	</h3>

	<h1>Sveltekit auth starter</h1>

	<code-example>
		<span>pnpm install</span>
		<span>pnpm run dev</span>
		<span>
			read <a href="https://github.com/TheCodingAtlas/sveltekit-auth-starter" target="_blank">
				docs
			</a>
		</span>
	</code-example>
</div>

<style lang="scss">
	h1 {
		font-size: 48px;
		text-align: center;
	}

	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 12px;
		left: 50%;
		position: absolute;
		text-align: end;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
	}

	code-example {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		text-align: center;
		font-size: 18px;
	}

	a {
		color: #fff;
	}
</style>
