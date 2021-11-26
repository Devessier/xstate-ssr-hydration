<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { appMachine } from '$lib/machines/app';
	import { interpret } from 'xstate';
	import type { StateFrom } from 'xstate';
	import { waitForState } from '$lib/machines/wait-for-state';

	export const load: Load = async ({ fetch }) => {
		const machineState = await waitForState(
			appMachine.withConfig({
				services: {
					fetchPage: async () => {
						const res = await fetch('/api.json');
						const { description } = await res.json();

						return description;
					}
				}
			}),
			(state) => {
				const hasFetchedPage = state.matches('fetchingPage') === true;

				return hasFetchedPage === false;
			}
		);

		return {
			props: {
				machineState
			}
		};
	};
</script>

<script lang="ts">
	export let machineState: StateFrom<typeof appMachine>;

	const initialState = appMachine.resolveState(machineState);
	const service = interpret(appMachine.withContext(initialState.context)).start(initialState);
</script>

<svelte:head>
	<title>XState SSR Hydration</title>
</svelte:head>

<h1>Barre des Écrins</h1>

<div>
	{@html $service.context.page}
</div>

<p>State machine current state: {JSON.stringify($service.value)}</p>

<button
	on:click={() => {
		service.send('LIKE');
	}}
>
	Like
</button>

<button
	on:click={() => {
		service.send('UNLIKE');
	}}
>
	Dislike
</button>
