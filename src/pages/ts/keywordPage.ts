import $ from "jquery";
import { keyword, objects, router, SqlBuilder } from "@core";
import { KeywordItem } from "@types";

let selectedKeyword: KeywordItem | null = null;
let allKeywords: KeywordItem[] = [];

init();

async function init() {
    const createCategoryBtn = $("#create-category-button");
    const createKeywordBtn = $("#create-keyword-button");
    const editBtn = $("#edit-button");
    const deleteBtn = $("#delete-button");
    const accordion = $('#keywords-accordion');
    const clearCacheBtn = $("#clear-cache-button");

    clearCacheBtn.on('click', async () => {
        keyword.clearCache();
        await keyword.reloadFromDatabase();
        location.reload();
    });

    accordion.html('');
    const kategorien = await objects.getAllKeywordCategories();

    accordion.accordion({
        exclusive: false
    });

    createCategoryBtn.on('click', () => {
        router.openPage(router.PAGES.Edit, { mode: "new", context: router.PAGES.Kategorie });
    });
    createKeywordBtn.on('click', () => {
        router.openPage(router.PAGES.Edit, { mode: "new", context: router.PAGES.Keyword });
    });
    editBtn.on('click', () => {
        if (selectedKeyword) {
            router.openPage(router.PAGES.Edit, { mode: "edit", context: router.PAGES.Keyword, id: selectedKeyword.getValue("KEYWORDID") });
        }
    });
    deleteBtn.on('click', async () => {
        if (selectedKeyword) {
            await objects.deleteObject(router.PAGES.Keyword, selectedKeyword.uid);
            location.reload();
        }
    });

    $(document).on('click', '.keyword-item', function (e) {
        e.stopPropagation();
        deselectAll();
        $(this).addClass('selected');
        const keyid = $(this).data('keyid');
        const keyword = allKeywords.find(k => k.getValue("KEYID") === keyid);
        if (keyword) {
            selectKeyword(keyword);
        }
    });

    $(document).on('click', (e) => {
        if (!$(e.target).closest('.keyword-item, #edit-button, #delete-button').length) {
            deselectAll();
        }
    });

    let categoriesWithKeys = await objects.getAllKeywordCategoriesWithKeysAsMap();

    for (let [category, keywords] of categoriesWithKeys) {
        let katHtml = category.createHtml();
        accordion.append(katHtml);

        const grid = katHtml.find('.keyword-grid');

        for (let keywordItem of keywords) {
            let keywordItemHtml = keywordItem.createHtml();

            allKeywords.push(keywordItem);
            grid.append(keywordItemHtml);
        }
    }

    $('#keywords-accordion').accordion({
        exclusive: false
    });

    for (let [category, keywords] of categoriesWithKeys) {
        category.attachEvents();
    }

    function selectKeyword(keyword: KeywordItem) {
        editBtn.css("display", "");
        deleteBtn.css("display", "");
        selectedKeyword = keyword;
    }
    function deselectAll() {
        editBtn.css("display", "none");
        deleteBtn.css("display", "none");
        $('.keyword-item').removeClass('selected');
        selectedKeyword = null;
    }
}