import { keyword, SqlBuilder } from "@core";
import { KeywordData } from "@types";

type ConsumerResult = [string, KeywordData][] | [string, string][];

export class Consumer {
    private source: string | (() => Promise<ConsumerResult> | ConsumerResult);

    constructor(source: string | (() => Promise<ConsumerResult> | ConsumerResult)) {
        this.source = source;
    }

    async getValues(): Promise<ConsumerResult> {
        if(typeof this.source === 'string') {
            return keyword.getByCategory(this.source);
        } else {
            const result = this.source();
            if(result instanceof Promise) {
                return await result;
            } else {
                return result;
            }
        }
    }

    static fromCategory(category: string): Consumer {
        return new Consumer(category);
    }

    static fromFunction(fn: () => Promise<ConsumerResult> | ConsumerResult): Consumer {
        return new Consumer(fn);
    }
}