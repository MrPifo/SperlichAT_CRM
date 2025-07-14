export class Event<T = void> {
	private listeners: Array<(arg: T) => void> = [];

	addListener(callback: (arg: T) => void): void {
		this.listeners.push(callback);
	}
	removeListener(callback: (arg: T) => void): void {
		const index = this.listeners.indexOf(callback);
		if (index > -1) {
			this.listeners.splice(index, 1);
		}
	}
	removeAllListeners(): void {
		this.listeners = [];
	}
	invoke(arg: T): void {
		this.listeners.forEach(listener => listener(arg));
	}
	get listenerCount(): number {
		return this.listeners.length;
	}
}