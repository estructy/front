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

	let { children, data } = $props();

	function newTransaction() {
		goto(
			replaceParams(routes.newTransaction, {
				accountId: data?.accountId ?? ''
			})
		);
	}

	onMount(() => {
		loadNotificationsFromLocalStore();
	});
</script>

<svelte:window onbeforeunload={() => saveNotificationsToLocalStore()} />

<Sidebar.Provider>
	<AppSidebar accountId={data.accountId} />
	<Sidebar.Inset>
		<header
			class="border-b-solid flex h-16 shrink-0 items-center gap-2 border-b-1 border-gray-200 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex w-full items-center justify-between gap-2 px-4">
				<!--<Sidebar.Trigger class="-ml-1" />-->
				<!--<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />-->
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item class="hidden md:block">
							<Breadcrumb.Link href="#">Building Your Application</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator class="hidden md:block" />
						<Breadcrumb.Item>
							<Breadcrumb.Page>New Transaction</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>

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

		<MobileNavBar {newTransaction} accountId={data.accountId} />
	</Sidebar.Inset>
</Sidebar.Provider>
