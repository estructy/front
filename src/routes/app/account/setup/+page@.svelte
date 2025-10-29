<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
	<div class="w-full max-w-sm">
		<Card.Root class="w-full max-w-sm">
			<Card.Header>
				<Card.Title>Setup Account</Card.Title>
				<Card.Description>Please provide a name for your account.</Card.Description>
			</Card.Header>
			<Card.Content>
				<form>
					<div class="flex flex-col gap-6">
						<div class="grid gap-2">
							<Label for="account">Name</Label>
							<Input id="account" value="Personal account" required />
						</div>
					</div>
				</form>
			</Card.Content>
			<Card.Footer class="flex-col gap-2">
				<Button type="submit" class="w-full">Complete Setup</Button>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
