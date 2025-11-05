<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { authClient } from '@/auth-client';
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import BellIcon from '@lucide/svelte/icons/bell';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import Languages from '@lucide/svelte/icons/languages';
	import { setLocale, locales, isLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages';

	let { user }: { user: { name: string; email: string; avatar: string } } = $props();
	const sidebar = useSidebar();

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
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
						<ChevronsUpDownIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger
							><Languages />
							{m.nav_user_language()}
						</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent>
							{#each localeOptions as locale (locale.value)}
								<DropdownMenu.Item
									onclick={() => {
										if (isLocale(locale.value)) {
											setLocale(locale.value);
										}
									}}
								>
									{locale.label}
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>
					<!--<DropdownMenu.Item>-->
					<!--<SparklesIcon />-->
					<!--Upgrade to Pro-->
					<!--</DropdownMenu.Item>-->
				</DropdownMenu.Group>
				<!--<DropdownMenu.Separator />-->
				<!--<DropdownMenu.Group>-->
				<!--<DropdownMenu.Item>-->
				<!--<BadgeCheckIcon />-->
				<!--Account-->
				<!--</DropdownMenu.Item>-->
				<!--<DropdownMenu.Item>-->
				<!--<CreditCardIcon />-->
				<!--Billing-->
				<!--</DropdownMenu.Item>-->
				<!--<DropdownMenu.Item>-->
				<!--<BellIcon />-->
				<!--Notifications-->
				<!--</DropdownMenu.Item>-->
				<!--</DropdownMenu.Group>-->
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					onclick={async () =>
						await authClient.signOut({
							fetchOptions: {
								onSuccess: () => {
									goto('/sign-in');
								}
							}
						})}
				>
					<LogOutIcon />
					{m.nav_user_logout()}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
