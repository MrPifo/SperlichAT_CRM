import { ILocal, OperatingState, State, sys } from "@core";

export function onStateProcess(local:ILocal): State {
	if (sys.operatingState == OperatingState.NEW) {
		return State.INVISIBLE;
	}

	return State.AUTO;
}