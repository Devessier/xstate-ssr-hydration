import { assign } from 'xstate';
import { createModel } from 'xstate/lib/model.js';

const appModel = createModel(
	{
		page: ''
	},
	{
		events: {
			LIKE: () => ({}),
			UNLIKE: () => ({})
		}
	}
);

export const appMachine = appModel.createMachine({
	initial: 'fetchingPage',

	states: {
		fetchingPage: {
			invoke: {
				src: 'fetchPage',

				onDone: {
					target: 'fetchedPage',

					actions: assign({
						page: (_, event) => event.data
					})
				},

				onError: {
					target: 'errored'
				}
			}
		},

		fetchedPage: {
			initial: 'idle',

			states: {
				idle: {},

				liked: {},

				unliked: {}
			},

			on: {
				LIKE: {
					target: '.liked'
				},

				UNLIKE: {
					target: '.unliked'
				}
			}
		},

		errored: {}
	}
});
