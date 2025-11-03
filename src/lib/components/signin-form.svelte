<script lang="ts">
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { authClient } from '@/auth-client';
	import Spinner from './ui/spinner/spinner.svelte';
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const id = $props.id();

	let email = $state('');
	let isValidEmail = $derived.by(() => emailValidation(email));

	let loading = $state(false);
	let authError = $state<string | undefined>(undefined);

	function emailValidation(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function termsOfService() {
		const message = m
			.sign_in_terms_description({
				action: m.sign_in_button().toLowerCase()
			})
			.replace('/t', `<a href="##">${m.sign_in_terms()}</a>`)
			.replace('/p', `<a href="##">${m.sign_in_privacy()}</a>`);
		return message;
	}
</script>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<form>
		<FieldGroup>
			<div class="flex flex-col items-center gap-2 text-center">
				<a href="##" class="flex flex-col items-center gap-2 font-medium">
					<div class="flex size-8 items-center justify-center rounded-md">
						<GalleryVerticalEndIcon class="size-6" />
					</div>
					<span class="sr-only">Estructy</span>
				</a>
				<h1 class="text-xl font-bold">{m.sign_in_welcome_message()}</h1>
			</div>
			<Field>
				<FieldLabel for="email-{id}">Email</FieldLabel>
				<Input
					id="email-{id}"
					type="email"
					placeholder={m.sign_in_email_placeholder()}
					required
					bind:value={email}
				/>
			</Field>
			<Field>
				<Button
					disabled={loading || !isValidEmail}
					onclick={async () => {
						authError = undefined;
						loading = true;
						const { error } = await authClient.emailOtp.sendVerificationOtp({
							email,
							type: 'sign-in'
						});
						loading = false;

						if (error) {
							authError = error.message;
						} else {
							goto(`/sign-in/verify-otp?email=${encodeURIComponent(email)}`);
						}
					}}
					>{m.sign_in_button()}

					{#if loading}
						<Spinner />
					{/if}
				</Button>
				<FieldDescription class="text-center">
					{#if authError}
						<span class="text-destructive">{authError}</span>
					{:else}
						{m.sign_in_field_description()}
					{/if}
				</FieldDescription>
			</Field>
		</FieldGroup>
	</form>
	<FieldDescription class="px-6 text-center">
		{@html termsOfService()}
	</FieldDescription>
</div>
