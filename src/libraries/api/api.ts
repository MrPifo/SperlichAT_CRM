import axios, { AxiosResponse } from 'axios';
import { AxiosRequestConfig } from "axios";

export const api = {

	POST: "post",
	GET:"get",
	token: localStorage.getItem("token"),
	apiUrl: "https://sperlich.at/api/crm/",
	paths: {
		GENERIC_SQL:"executeSql.php"
	},

	async requestFromDB(config?: IDBRequest) {
		if (config === undefined) {
			config = {};
		}
		if (config?.asMap == undefined) {
			config.asMap = false;
		}
		if (config.sql != null) {
			config.sql = this.encodeSQL(config.sql);
		}
		
		let result = await this.request(this.paths.GENERIC_SQL, config);
		return result;
	},
	async executeDB(sql:string, config?: IDBRequest) {
		if (config === undefined) {
			config = {};
		}
		
		config.sql = this.encodeSQL(sql);
		
		let result = await this.request(this.paths.GENERIC_SQL, config);
		
		return result;
	},
	async request(path:string, config?:IRequestConfig) {
		if (config == null) {
			config = {};
		}
		if (config.token === undefined) {
			config.token = this.token ?? "";
		}
		if (config.timeout === undefined) {
			config.timeout = 10000;
		}
		if (config.method === undefined) {
			config.method = this.POST;
		}
	
		let url: any = new URL(path, this.apiUrl);
		if (url.toString().slice(-4) != '.php') {
			url += ".php";
		}
		
		let response:AxiosResponse;

		try {
			switch (config.method) {
				default:
				case this.POST:
					response = await axios.post(url.toString(), config);
					break;
				case this.GET:
					response = await axios.get(url.toString(), config);
					break;
			}
		} catch (error:any) {
			throw error.response.data.errorMessage;
		}

		return response;
	},
	encodeSQL(sql:string):string {
		const encoder = new TextEncoder();
		const data = encoder.encode(sql);
		const base64 = btoa(String.fromCharCode(...data));
		return base64;
	}
}
interface IRequestConfig extends AxiosRequestConfig {

	token?: string;

}
interface IDBRequest extends IRequestConfig {

	sql?: string;
	singleRow?: boolean;
	asMap?: boolean;

}