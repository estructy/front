<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client as zodClient } from 'sveltekit-superforms/adapters';
	import { createAccountSchema } from './schema';
	import * as Select from '$lib/components/ui/select';
	import { z } from 'zod/v4';
	import { goto } from '$app/navigation';
	import Spinner from '@/components/ui/spinner/spinner.svelte';

	const INVITE_LIMIT = 1;

	type CurrencryCodes = 'BRL' | 'USD' | 'EUR' | 'ARS' | 'PYG' | 'CLP' | 'UYU';

	const currencyOptions = {
		BRL: 'BRL - Brazilian Real',
		USD: 'USD - US Dollar',
		EUR: 'EUR - Euro',
		ARS: 'ARS - Argentine Peso',
		PYG: 'PYG - Paraguayan Guarani',
		CLP: 'CLP - Chilean Peso',
		UYU: 'UYU - Uruguayan Peso'
	};

	const { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(createAccountSchema),
		validationMethod: 'onsubmit',
		onResult: async (event) => {
			switch (event.result.type) {
				case 'success':
				case 'failure':
					break;
			}
		}
	});
	const { form: formData, enhance, submitting } = form;

	let triggerContent = $derived(
		currencyOptions[$formData.currency as CurrencryCodes] || currencyOptions.BRL
	);

	let isFormValid = $derived.by(() => {
		return createAccountSchema.safeParse($formData).success === false;
	});

	$formData.currency ||= 'BRL';
	$formData.accountName ||= 'Personal Account';
	$formData.invites ||= [''];

	function handleInviteInput(value: string, index: number) {
		if (!$formData.invites) return;

		$formData.invites[index] = value;

		if (
			index === $formData.invites.length - 1 &&
			$formData.invites.length < INVITE_LIMIT &&
			value.trim() !== ''
		) {
			$formData.invites = [...$formData.invites, ''];
		}
	}

	function isEmail(email: string): boolean {
		if (!email) return true;
		const emailSchema = z.object({
			email: z.email()
		});

		const result = emailSchema.safeParse({ email });
		return result.success;
	}
</script>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>Setup Account</Card.Title>
			<Card.Description
				>Please provide a name for your account. You can edit this later.</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance>
				<div class="flex flex-col gap-6">
					<Form.Field {form} name="userName">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Your Name<span class="text-red-500">*</span></Form.Label>
								<Input {...props} bind:value={$formData.userName} placeholder="John Doe" />
							{/snippet}
						</Form.Control>
						<Form.Description>
							Enter your name, nickname, or whatever you prefer to be called.
						</Form.Description>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="accountName">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Account Name<span class="text-red-500">*</span></Form.Label>
								<Input
									{...props}
									bind:value={$formData.accountName}
									placeholder="Personal Account"
								/>
							{/snippet}
						</Form.Control>
						<Form.Description>
							Give your account a name to easily identify it later.
						</Form.Description>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="currency">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Currency <span class="text-red-500">*</span></Form.Label>
								<Select.Root
									{...props}
									type="single"
									name="currency"
									bind:value={$formData.currency}
								>
									<Select.Trigger class="w-full">
										{triggerContent}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(currencyOptions) as [code, name]}
											<Select.Item value={code}>{name}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.Description>
							Select the currency for this account. Later on, you can add transactions in different
							currencies.
						</Form.Description>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="invites">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Invites (optional)</Form.Label>
								{#each $formData.invites as string[] as _, i}
									<Input
										{...props}
										placeholder="foo@bar.com"
										type="email"
										oninput={(e) => handleInviteInput(e.target.value, i)}
										aria-invalid={$formData.invites && isEmail($formData.invites[i]) === false
											? 'true'
											: 'false'}
									/>
								{/each}
							{/snippet}
						</Form.Control>
						<Form.Description>
							Invite friends or colleagues to join your account by entering their email addresses.
						</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="mt-6 flex-col gap-2">
					<Button type="submit" class="w-full" disabled={isFormValid || $submitting}
						>Complete Setup {#if $submitting}<Spinner />{/if}</Button
					>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
