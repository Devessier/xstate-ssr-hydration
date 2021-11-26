import type { StateMachine, EventObject, State, StateFrom } from 'xstate';
import { interpret } from 'xstate';

export function waitForState<TContext extends Record<string, unknown>, TEvent extends EventObject>(
	machine: StateMachine<TContext, any, TEvent>,
	selector: (state: State<TContext, TEvent>, event: TEvent) => boolean
): Promise<StateFrom<typeof machine>> {
	return new Promise((resolve) => {
		const service = interpret(machine)
			.onTransition((updatedState, event) => {
				const isEnd = selector(updatedState, event);
				if (isEnd === true) {
					service.stop();
					resolve(updatedState);

					return;
				}
			})
			.start();
	});
}
