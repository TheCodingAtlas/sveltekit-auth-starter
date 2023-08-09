<script lang="ts">
	import type { ActionData } from './$types';
	import RegistrationLoginForm from '$lib/components/registration-login-form/RegistrationLoginForm.svelte';

	// Must create here and pass into form or
	// otherwise it does work correctly.
	export let form: ActionData;
</script>

<RegistrationLoginForm {form} isRegistration={true} />
