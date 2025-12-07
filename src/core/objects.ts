import $ from 'jquery';
import { db, router, SqlBuilder, utils } from '@core';
import { Context, KeywordCategory, KeywordItem, Kontakt } from '@types';

class Objects {
    async getDataByContext(contextName: string, uid?: string | null, orderByField?: string): Promise<Record<string, string>> {
        const context = utils.getContextByName(contextName);
        const sqlBuilder = new SqlBuilder()
            .select(context!.getFieldNames())
            .from(context.table);

        if (uid != null) {
            sqlBuilder.where(context.primaryKey, uid);
        }
        if (orderByField != null) {
            sqlBuilder.orderBy(orderByField);
        }

        return await sqlBuilder.table(true);
    }
    async getAllKontakts(): Promise<Kontakt[]> {
        const context = utils.getContextByName(router.PAGES.Kontakt);
        return (await new SqlBuilder()
            .select(context!.getFieldNames())
            .from(context.table)
            .orderBy("FIRSTNAME")
            .orderBy("LASTNAME")
            .table(true))
            .map((p: any) => {
                let kontakt = new Kontakt();
                kontakt.setValues(p);

                return kontakt;
            });
    }
    async getKontaktById(id: string): Promise<Kontakt | null> {
        const context = utils.getContextByName(router.PAGES.Kontakt);
        const data = await new SqlBuilder()
            .select(context!.getFieldNames())
            .from(context.table)
            .where(context.primaryKey, id)
            .row(true);

        return data ? Object.assign(new Kontakt(), data) : null;
    }
    async getAllKeywordCategories(): Promise<KeywordCategory[]> {
        const context = utils.getContextByName(router.PAGES.Kategorie);
        return (await new SqlBuilder()
            .select(context!.getFieldNames())
            .from(context.table)
            .orderBy("TITLE")
            .table(true))
            .map((k: any) => {
                let kategorie = new KeywordCategory();
                kategorie.setValues(k);

                return kategorie;
            });
    }
    async getAllKeywordCategoriesWithKeysAsMap(): Promise<Map<KeywordCategory, KeywordItem[]>> {
        const categoryContext = utils.getContextByName(router.PAGES.Kategorie);
        const keywordContext = utils.getContextByName(router.PAGES.Keyword);
        
        const categoryFields = categoryContext.getFieldNames().map(f => `c.${f} as c_${f}`);
        const keywordFields = keywordContext.getFieldNames().map(f => `k.${f} as k_${f}`);
        
        const results = await new SqlBuilder()
            .select([...categoryFields, ...keywordFields])
            .from("CATEGORY c LEFT JOIN KEYWORD k ON c.CATEGORYID = k.CATEGORY_ID")
            .orderBy("c.NAME")
            .orderBy("k.TITLE")
            .table(true);

        const resultMap = new Map<KeywordCategory, KeywordItem[]>();
        const categoryMap = new Map<string, KeywordCategory>();

        for (let row of results) {
            const categoryId = row['c_CATEGORYID'];
            
            if (!categoryMap.has(categoryId)) {
                const category = new KeywordCategory();
                const categoryData: Record<string, any> = {};
                categoryContext.getFieldNames().forEach(f => {
                    categoryData[f] = row[`c_${f}`];
                });
                category.setValues(categoryData);
                categoryMap.set(categoryId, category);
                resultMap.set(category, []);
            }

            if (row['k_KEYWORDID']) {
                const keyword = new KeywordItem();
                const keywordData: Record<string, any> = {};
                keywordContext.getFieldNames().forEach(f => {
                    keywordData[f] = row[`k_${f}`];
                });
                keyword.setValues(keywordData);
                
                const category = categoryMap.get(categoryId)!;
                resultMap.get(category)!.push(keyword);
            }
        }

        const ungroupedKeywords = await new SqlBuilder()
            .select(keywordContext.getFieldNames())
            .from(keywordContext.table)
            .where("CATEGORY_ID IS NULL OR CATEGORY_ID NOT IN (SELECT CATEGORYID FROM CATEGORY)")
            .orderBy("TITLE")
            .table(true);

        if (ungroupedKeywords.length > 0) {
            const ungroupedCategory = new KeywordCategory();
            ungroupedCategory.setValues({
                CATEGORYID: "UNGROUPED",
                NAME: "Ungruppiert",
                ICON: "question circle",
                COLOR: "grey"
            });
            
            const keywords = ungroupedKeywords.map((k: any) => {
                let keyword = new KeywordItem();
                keyword.setValues(k);
                return keyword;
            });
            
            const newMap = new Map<KeywordCategory, KeywordItem[]>();
            newMap.set(ungroupedCategory, keywords);
            
            for (let [cat, keys] of resultMap) {
                newMap.set(cat, keys);
            }
            
            return newMap;
        }

        return resultMap;
    }
    async getKeywordsByCategoryId(categoryId: string): Promise<KeywordCategory[]> {
        const context = utils.getContextByName(router.PAGES.Kategorie);
        return (await new SqlBuilder()
            .select(context!.getFieldNames())
            .from(context.table)
            .where("CATEGORY_ID", categoryId)
            .orderBy("TITLE")
            .table(true))
            .map((k: any) => {
                let kategorie = new KeywordCategory();
                kategorie.setValues(k);

                return kategorie;
            });
    }
    async deleteObject(contextName: string, uid: string) {
        let context: Context = utils.getContextByName(contextName);
        await db.deleteById(context.table, context.primaryKey, uid);
    }
}

export const objects = new Objects();