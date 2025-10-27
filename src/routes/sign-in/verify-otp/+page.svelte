<script lang="ts">
	import SignInOtpForm from '@/components/sign-in-otp-form.svelte';

	import { onMount } from 'svelte';

	let email = $state('');

	onMount(() => {
		const params = new URLSearchParams(window.location.search);

		email = params.get('email') || '';
	});
</script>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
	<div class="w-full max-w-sm">
		<SignInOtpForm />
	</div>
</div>
