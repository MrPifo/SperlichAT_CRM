import { Context, KeywordCategory, KeywordItem, Kontakt } from '@types';
import {v4 as uuidv4} from 'uuid';
import { router } from '@core';

const AVATAR_COLOR_PALETTE = [
    // ROTTÖNE
    '#ec2f2fff', // Kräftiges Rot
    '#e03d3dff', // Dunkelrot
    '#bd3838ff', // Tiefes Rot

    // ORANGETÖNE
    '#ff9b49ff', // Dunkelorange
    '#ffac3fff', // Kräftiges Orange
    '#ffa245ff', // Mittelorange

    // GELBTÖNE
    '#F9A825', // Kräftiges Gelb-Orange
    '#FFC107', // Goldgelb
    '#FFD700', // Reines Goldgelb

    // GRÜNTÖNE
    '#9de062ff', // Olivgrün

    // TÜRKIS/AQUATÖNE
    '#0097A7', // Dunkles Cyan
    '#00BCD4', // Türkis
    '#00ACC1', // Mittel-Türkis

    // BLAUTÖNE
    '#1976D2', // Kräftiges Blau
    '#2196F3', // Helles Blau
    '#1565C0', // Tiefes Blau

    // VIOLETTTÖNE
    '#673AB7', // Kräftiges Violett
    '#5E35B1', // Tiefes Violett
    '#7B1FA2', // Dunkles Magenta

    // BRAUN/GRAU-TÖNE (als neutrale Abwechslung)
    '#5D4037', // Dunkelbraun
    '#455A64', // Blau-Grau
    '#757575'  // Mittelgrau
]; // Gesamt: 24 Farben

class Utils {

    getUUID():string {
        return uuidv4();
    }
    getContextByName(name:string):Context {
        switch(name.toLowerCase()) {
            case router.PAGES.Kontakt:
                return new Kontakt();
            case router.PAGES.Kategorie:
                return new KeywordCategory();
            case router.PAGES.Keyword:
                return new KeywordItem();
        }

        throw new Error(`Context ${name} doesnt exist!`);
    }
    toBoolean(value: any): boolean {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'number') return value === 1;
        if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true';
        return false;
    }
    parseNull(value:any):string|null {
        if(this.isNullOrEmpty(value)) {
            return null;
        }

        return value.toString();
    }
    isNullOrEmpty(value: any): boolean {
        return value == null || value === '' || (Array.isArray(value) && value.length === 0);
    }

    isNotNullOrEmpty(value: any): boolean {
        return this.isNullOrEmpty(value) == false;
    }

    /**
     * Generiert eine deterministische Hex-Farbe basierend auf einem String (z.B. Initialen)
     * aus einer vordefinierten Palette.
     * @param str Der Eingabestring, der als Seed für die Farbauswahl dient.
     * @returns Eine Hex-Farbe als String (z.B. '#F26419').
     */
    getDeterministicAvatarColor(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            // Generiert einen Hash-Wert aus dem String
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        // Stellt sicher, dass der Hash-Wert nicht negativ ist
        const positiveHash = hash >>> 0; 
        
        // Wählt einen Index aus der Palette basierend auf dem Modulo des Hash-Werts
        const index = positiveHash % AVATAR_COLOR_PALETTE.length;
        
        return AVATAR_COLOR_PALETTE[index];
    }
    
    // Die alte stringToHslColor wurde entfernt und durch getDeterministicAvatarColor ersetzt
}
export var utils = new Utils();