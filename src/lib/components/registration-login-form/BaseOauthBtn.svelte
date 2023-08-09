<script lang="ts">
	export let href = '';
</script>

<a {href} role="button" tabindex="0">
	<icn-holder>
		<slot />
	</icn-holder>

	<btn-txt>
		<slot name="txt" />
	</btn-txt>
</a>

<style lang="scss">
	a {
		align-items: center;
		background-color: rgb(87, 91, 199);
		border-radius: 4px;
		border: 1px solid rgb(87, 91, 199);
		box-sizing: border-box;
		color: rgb(255, 255, 255);
		display: flex;
		font-size: 14px;
		gap: 12px;
		height: 48px;
		justify-content: center;
		padding: 0;
		text-decoration: none;
		white-space: nowrap;
		width: 100%;
	}

	icn-holder {
		width: 24px;

		:global(svg) {
			width: 100%;
		}
	}
</style>
