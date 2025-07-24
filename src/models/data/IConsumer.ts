import { IProvider } from "./IProvider";

export interface IConsumer {

	name:string,
	context: string,
	originContext?: string,
	provider?: string|IProvider,
	params?:Record<string, any>

}