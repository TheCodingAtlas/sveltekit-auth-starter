<script lang="ts">
	// Yea yea, I know it looks exactly like https://linear.app/signup.
	// It's because I took their styling...move along...
	import { enhance } from '$app/forms';
	import type { ActionData } from '.svelte-kit/types/src/routes/(public)/signup/$types';
	import GithubOAuthBtn from './GithubOAuthBtn.svelte';
	import GoogleOAuthBtn from './GoogleOAuthBtn.svelte';

	export let isRegistration = false;

	$: submitTitle = isRegistration ? 'Create account' : 'Login';
	export let form: ActionData;
</script>

<registration-login-form-holder>
	<h2>
		{#if isRegistration}
			Create your account
		{:else}
			Log into your account
		{/if}
	</h2>

	<oauth-btns>
		<GoogleOAuthBtn />
		<GithubOAuthBtn />
	</oauth-btns>

	<div-ider>
		<line-left />
		or
		<line-right />
	</div-ider>

	{#if form?.message}
		<p class="error">{form.message}</p>
	{/if}

	<form method="post" use:enhance>
		<input type="email" name="email" id="email" placeholder="Email address" />
		<input type="password" name="password" id="password" placeholder="Password" />

		{#if isRegistration}
			<input
				type="password"
				name="password_repeat"
				id="password_repeat"
				placeholder="Repeat password"
			/>
		{/if}

		<input type="submit" value={submitTitle} />
	</form>

	{#if isRegistration}
		<terms-txt>
			By signing up, you agree to the <a href="/terms">Terms of Service</a>
			<br />
			and
			<a href="/dpa">Data Processing Agreement.</a>
		</terms-txt>
	{/if}
</registration-login-form-holder>

<style lang="scss">
	registration-login-form-holder {
		align-items: center;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		height: 100vh;
		justify-content: center;
		margin: 0 auto;
		max-width: 320px;
		position: relative;
		width: 80%;
		z-index: 1;
	}

	oauth-btns {
		align-items: center;
		display: flex;
		flex-direction: column;
		gap: 16px;
		justify-content: center;
		width: 100%;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;

		input {
			background: rgb(21, 22, 33);
			border-radius: 4px;
			border: 1px solid rgb(49, 50, 72);
			box-sizing: border-box;
			color: rgb(238, 239, 252);
			display: block;
			font-size: 0.8125rem;
			height: 48px;
			margin: 0px;
			padding: 6px 12px;
			transition: border 0.375s;
			width: 100%;
		}

		input:focus {
			border-color: rgb(108, 121, 255);
			outline: none;
		}

		input[type='submit'] {
			background-color: rgb(43, 44, 68);
			border-color: rgb(62, 62, 74);
			color: rgb(210, 211, 224);
		}
	}

	div-ider {
		align-items: center;
		color: #fff;
		display: flex;
		gap: 16px;
		justify-content: center;
		margin: 24px 0;
		position: relative;
		width: 100%;

		line-left,
		line-right {
			background: #fff;
			display: block;
			flex-grow: 1;
			height: 1px;
			opacity: 0.1;
		}
	}

	terms-txt {
		color: rgb(133, 134, 153);
		display: block;
		font-size: 14px;
		line-height: 2;
		margin-top: 32px;
		text-align: center;

		a {
			color: rgb(133, 134, 153);
		}
	}
</style>
