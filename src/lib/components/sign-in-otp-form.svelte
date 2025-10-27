<script lang="ts">
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription
	} from '$lib/components/ui/field/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { authClient } from '@/auth-client';
	import Spinner from './ui/spinner/spinner.svelte';
	import { goto } from '$app/navigation';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { z } from 'zod/v4';
	import { onMount } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	let email = $state('');
	let loading = $state(false);
	let authError = $state<string | undefined>(undefined);
	let otp = $state<string>('');
	let isValidOtp = $derived.by(() => {
		const otpSchema = z
			.string()
			.length(6)
			.regex(/^\d{6}$/);
		return otpSchema.safeParse(otp).success;
	});

	let resendOtpLoading = $state(false);
	let resendTimer = $state(30);
	let newOtpLoading = $state(false);

	function disabledButtonTimeout() {
		resendOtpLoading = true;
		const interval = setInterval(() => {
			resendTimer -= 1;
			if (resendTimer <= 0) {
				clearInterval(interval);
				resendOtpLoading = false;
				resendTimer = 30;
			}
		}, 1000);
	}
	onMount(() => {
		const params = new URLSearchParams(window.location.search);

		email = params.get('email') || '';
		disabledButtonTimeout();
	});
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
				<h1 class="text-xl font-bold">Welcome to Estructy</h1>
			</div>
			<Field>
				<FieldLabel>Enter the 6-digit code sent to your email</FieldLabel>
				<InputOTP.Root maxlength={6} class="justify-center" bind:value={otp}>
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells.slice(0, 2) as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
						<InputOTP.Separator />
						<InputOTP.Group>
							{#each cells.slice(2, 4) as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
						<InputOTP.Separator />
						<InputOTP.Group>
							{#each cells.slice(4, 6) as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
			</Field>
			<Field>
				<Button
					disabled={loading || !isValidOtp}
					onclick={async () => {
						authError = undefined;
						loading = true;
						await new Promise((resolve) => setTimeout(resolve, 1000));
						const { error } = await authClient.signIn.emailOtp({
							email,
							otp
						});
						loading = false;

						if (error) {
							authError = error.message;
						} else {
							goto(`/app`);
						}
					}}
					>Continue

					{#if loading}
						<Spinner />
					{/if}
				</Button>
				<Button
					variant="link"
					disabled={resendOtpLoading}
					onclick={async () => {
						authError = undefined;
						resendOtpLoading = true;
						newOtpLoading = true;
						await new Promise((resolve) => setTimeout(resolve, 1000));
						const { error } = await authClient.emailOtp.sendVerificationOtp({
							email,
							type: 'sign-in'
						});
						resendOtpLoading = false;
						newOtpLoading = false;
						disabledButtonTimeout();

						if (error) {
							authError = error.message;
						}
					}}
					>Resend OTP {#if resendOtpLoading && !newOtpLoading}(in {resendTimer}s){/if}
					{#if newOtpLoading}
						<Spinner />
					{/if}
				</Button>
				<FieldDescription class="text-center">
					{#if authError}
						<span class="text-destructive">{authError}</span>
					{:else}
						Sign in or create an account by entering your email
					{/if}
				</FieldDescription>
			</Field>
		</FieldGroup>
	</form>
	<FieldDescription class="px-6 text-center">
		By clicking continue, you agree to our <a href="##">Terms of Service</a> and
		<a href="##">Privacy Policy</a>.
	</FieldDescription>
</div>
