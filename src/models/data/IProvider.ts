import { Parameter } from "../parameter";

export interface IProvider {
	
	name:string,
	context: string,
	parameter:Record<string, Parameter>

}