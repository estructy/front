<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Button from '@/components/ui/button/button.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import MobileNavBar from '@/components/custom/mobile-nav-bar.svelte';
	import { goto } from '$app/navigation';
	import {
		loadNotificationsFromLocalStore,
		saveNotificationsToLocalStore
	} from '@/stores/notifications.svelte';
	import { onMount } from 'svelte';
	import { replaceParams, routes } from '@/routes.js';
	import Separator from '@/components/ui/separator/separator.svelte';
	import { page } from '$app/state';

	let { children, data } = $props();

	function newTransaction() {
		goto(
			replaceParams(routes.newTransaction, {
				accountId: data?.account.currentAccountId ?? ''
			})
		);
	}

	const breadcrumbs = $derived.by(() => {
		const path = page.url.pathname.replace(
			`/app/account/${data?.account.currentAccountId ?? ''}`,
			''
		);
		const segments = path.split('/').filter(Boolean);

		return segments.map((part, index) => {
			return {
				name: part.charAt(0).toUpperCase() + part.slice(1),
				href: `/app/account/${data?.account.currentAccountId ?? ''}/${segments.slice(0, index + 1).join('/')}`
			};
		});
	});

	onMount(() => {
		loadNotificationsFromLocalStore();
	});
</script>

<svelte:window onbeforeunload={() => saveNotificationsToLocalStore()} />

<Sidebar.Provider>
	<AppSidebar appAccount={data.account} />
	<Sidebar.Inset>
		<header
			class="border-b-solid flex h-16 shrink-0 items-center gap-2 border-b-1 border-gray-200 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex w-full items-center justify-between gap-2 px-4">
				<div class="flex items-center gap-2">
					<Separator orientation="vertical" class="h-4" />
					<Breadcrumb.Root>
						<Breadcrumb.List>
							{#each breadcrumbs as item, index}
								<Breadcrumb.Item>
									{#if index !== breadcrumbs.length - 1}
										<Breadcrumb.Link href={item.href}>{item.name}</Breadcrumb.Link>
										<Breadcrumb.Separator />
									{:else}
										<Breadcrumb.Page>{item.name}</Breadcrumb.Page>
									{/if}
								</Breadcrumb.Item>
							{/each}
						</Breadcrumb.List>
					</Breadcrumb.Root>
				</div>

				<Button
					class=" ml-auto hidden h-8 bg-indigo-600 px-3 text-white  hover:bg-indigo-700 hover:text-white md:inline-flex"
					variant="outline"
					size="sm"
					onclick={newTransaction}
				>
					<Plus /> New Transaction
				</Button>
			</div>
		</header>
		<!--<div class="flex flex-1 flex-col gap-4 p-4 pt-0">-->
		<!--<div class="grid auto-rows-min gap-4 md:grid-cols-3">-->
		<!--<div class="aspect-video rounded-xl bg-muted/50"></div>-->
		<!--<div class="aspect-video rounded-xl bg-muted/50"></div>-->
		<!--<div class="aspect-video rounded-xl bg-muted/50"></div>-->
		<!--</div>-->
		<!--<div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>-->
		<!--</div>-->

		<div class="px-4 pb-24 md:pb-4">
			{@render children?.()}
		</div>

		<MobileNavBar {newTransaction} accountId={data.account.currentAccountId} />
	</Sidebar.Inset>
</Sidebar.Provider>
