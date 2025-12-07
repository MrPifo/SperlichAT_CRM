import axios, { AxiosResponse } from 'axios';
import { AxiosRequestConfig } from "axios";
import { router } from '@core';

export const api = {

	POST: "post",
	GET:"get",
	paths: {
		GENERIC_SQL:"executeSql.php"
	},

	async requestFromDB(config?: IDBRequest) {
		if (config === undefined) {
			config = {};
		}
		if (config.asMap == undefined) {
			config.asMap = false;
		}
		if (config.sql != null) {
			config.sql = this.encodeSQL(config.sql);
		}
		if (config.singleRow == undefined) {
			config.singleRow = false;
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
	async request<T = any>(path: string, data?:any): Promise<T> {
		let url = new URL(path, router.API_URL).toString();
		if (!url.endsWith('.php')) url += '.php';

		const token = localStorage.getItem('auth_token');
		
		try {
			const response = await axios({
				url:url,
				method: 'POST',
				timeout: 10000,
				headers: {
					'Content-Type': 'application/json',
					...(token && { 'Authorization': `Bearer ${token}` })
				},
				data:data,
			});
			return response.data;
		} catch (error: any) {
			const message = error.response?.data?.errorMessage ?? error.message;
			console.error(`API-Request error: ${message}`);
			throw message;
		}
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