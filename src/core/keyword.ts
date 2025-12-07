import { Context, KeywordCategory, KeywordData } from '@types';
import {v4 as uuidv4} from 'uuid';
import { router, SqlBuilder, utils } from '@core';

class KeywordUtils {

    values: Record<string, Record<string, KeywordData>> = {};
    categoryNameMap: Record<string, string> = {};

    async loadAll() {
        let rawKeyStorage = localStorage.getItem("keywords");
        let rawCategoryStorage = localStorage.getItem("categories");
        
        if(rawKeyStorage != null && rawCategoryStorage != null) {
            this.values = JSON.parse(rawKeyStorage);
            this.categoryNameMap = JSON.parse(rawCategoryStorage);
        } else {
            await this.reloadFromDatabase();
        }
    }

    async reloadFromDatabase() {
        this.values = {};
        this.categoryNameMap = {};

        const categories = await new SqlBuilder()
            .select(["CATEGORYID", "NAME"])
            .from("CATEGORY")
            .table(true);

        for(let cat of categories) {
            this.categoryNameMap[cat.CATEGORYID] = cat.NAME;
            this.values[cat.NAME] = {};
        }

        const keys = await new SqlBuilder()
            .select(["KEYID", "TITLE", "CATEGORY_ID", "ICON", "COLOR", "ISACTIVE"])
            .from("KEYWORD")
            .orderBy("TITLE")
            .table(true);

        for(let val of keys) {
            const categoryName = this.categoryNameMap[val.CATEGORY_ID];
            if(categoryName) {
                this.values[categoryName][val.KEYID] = {
                    title: val.TITLE || '',
                    icon: val.ICON || '',
                    color: val.COLOR || '',
                    active: val.ISACTIVE ?? 1
                };
            }
        }
        
        localStorage.setItem("keywords", JSON.stringify(this.values));
        localStorage.setItem("categories", JSON.stringify(this.categoryNameMap));
    }

    clearCache() {
        localStorage.removeItem("keywords");
        localStorage.removeItem("categories");
        this.values = {};
        this.categoryNameMap = {};
    }

    getByCategory(categoryName: string): [string, KeywordData][] {
        if(!this.values[categoryName]) {
            return [];
        }
        return Object.entries(this.values[categoryName]);
    }

    getKeywordData(keyid: string): KeywordData | null {
        for (const category of Object.values(this.values)) {
            if (category[keyid]) {
                return category[keyid];
            }
        }
        return null;
    }

    async getCategories(asMap: boolean = true): Promise<string[][]> {
        let kategorien = await new SqlBuilder()
            .select(["CATEGORYID", "NAME", "ICON", "COLOR"])
            .from("CATEGORY")
            .orderBy("NAME")
            .table(asMap);
        return kategorien;
    }

    async getKeywordsByCategoryId(categoryId: string, asMap: boolean = true): Promise<string[][]> {
        let kategorien = await new SqlBuilder()
            .select(["KEYWORDID", "KEYID", "TITLE", "CATEGORY_ID", "ICON", "COLOR", "ISACTIVE"])
            .from("KEYWORD")
            .where("CATEGORY_ID", categoryId)
            .orderBy("TITLE")
            .table(asMap);
        return kategorien;
    }
}
export var keyword = new KeywordUtils();
keyword.loadAll();