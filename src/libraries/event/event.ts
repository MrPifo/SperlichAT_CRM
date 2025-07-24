export class Event<T = void, R = void> {
	private listeners: Array<(arg: T) => R> = [];

	addListener(callback: (arg: T) => R): void {
		this.listeners.push(callback);
	}
	removeListener(callback: (arg: T) => R): void {
		const index = this.listeners.indexOf(callback);
		if (index > -1) {
			this.listeners.splice(index, 1);
		}
	}
	removeAllListeners(): void {
		this.listeners = [];
	}
	invoke(arg: T): R[] {
		return this.listeners.map(listener => listener(arg));
	}
	invokeFirst(arg: T): R | undefined {
		if (this.listeners.length > 0) {
			return this.listeners[0](arg);
		}
		return undefined;
	}
	invokeLast(arg: T): R | undefined {
		if (this.listeners.length > 0) {
			return this.listeners[this.listeners.length - 1](arg);
		}
		return undefined;
	}
	get listenerCount(): number {
		return this.listeners.length;
	}
}