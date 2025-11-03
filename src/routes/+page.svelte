<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select/index.js';
	import { setLocale, locales, isLocale } from '$lib/paraglide/runtime';
	import Button from '@/components/ui/button/button.svelte';
	import { m } from '$lib/paraglide/messages';

	console.log(locales);

	const localeOptions: {
		value: string;
		label: string;
	}[] = locales.map((loc) => {
		let label: string = '';

		if (loc === 'en') {
			label = 'English 🇺🇸';
		} else if (loc === 'es') {
			label = 'Español 🇪🇸';
		} else if (loc === 'pt-BR') {
			label = 'Português (Brasil) 🇧🇷';
		}

		return {
			value: loc,
			label
		};
	});

	let value = $state('');

	const triggerContent = $derived.by(() => {
		if (value === '') {
			return 'Select language';
		}

		const selected = localeOptions.find((loc) => loc.value === value);
		return selected ? selected.label : 'Select language';
	});

	$effect(() => {
		if (value !== '' && isLocale(value)) {
			setLocale(value);
		}
	});
</script>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
	<Select.Root type="single" name="favoriteFruit" bind:value>
		<Select.Trigger class="w-[180px]">
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Language</Select.Label>
				{#each localeOptions as locale (locale.value)}
					<Select.Item value={locale.value} label={locale.label}>
						{locale.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>

	<Button variant="outline" onclick={() => goto('sign-in')}>{m.go_to_sign_in()}</Button>
</div>
