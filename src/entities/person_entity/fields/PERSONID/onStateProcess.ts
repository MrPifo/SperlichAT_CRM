import { local, OperatingState, State, sys } from "@core";

export function onStateProcess(): State {
	if (sys.operatingState == OperatingState.NEW) {
		return State.INVISIBLE;
	}

	return State.AUTO;
}