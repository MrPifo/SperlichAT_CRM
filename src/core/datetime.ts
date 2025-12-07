import { utils } from "@core";

class DateTime {

    format(value: string | Date | null, pattern: string = 'dd.MM.yyyy'): string {
        if (!value || value === '0000-00-00') return '';

        const date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) return '';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return pattern
            .replace('yyyy', year)
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }
    today(pattern: string = 'dd.MM.yyyy'): string {
        return this.format(this.today(), pattern);
    }
    addDays(date: Date | string, days: number): Date {
        const d = date instanceof Date ? new Date(date) : new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }

    addMonths(date: Date | string, months: number): Date {
        const d = date instanceof Date ? new Date(date) : new Date(date);
        d.setMonth(d.getMonth() + months);
        return d;
    }

    addYears(date: Date | string, years: number): Date {
        const d = date instanceof Date ? new Date(date) : new Date(date);
        d.setFullYear(d.getFullYear() + years);
        return d;
    }

    diffDays(date1: Date | string, date2: Date | string): number {
        const d1 = date1 instanceof Date ? date1 : new Date(date1);
        const d2 = date2 instanceof Date ? date2 : new Date(date2);
        const diff = Math.abs(d2.getTime() - d1.getTime());
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    isToday(date: Date | string): boolean {
        const d = date instanceof Date ? date : new Date(date);
        const today = this.today();
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    }

    isPast(date: Date | string): boolean {
        const d = date instanceof Date ? date : new Date(date);
        return d < this.today();
    }

    isFuture(date: Date | string): boolean {
        const d = date instanceof Date ? date : new Date(date);
        return d > this.today();
    }

    getAge(birthdate: Date | string): number {
        const birth = birthdate instanceof Date ? birthdate : new Date(birthdate);
        const today = this.today();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    parse(value: string, pattern: string = 'dd.MM.yyyy'): Date | null {
        if (!value) return null;

        const parts: Record<string, number> = {};
        let regex = pattern
            .replace('yyyy', '(?<year>\\d{4})')
            .replace('MM', '(?<month>\\d{2})')
            .replace('dd', '(?<day>\\d{2})')
            .replace('HH', '(?<hours>\\d{2})')
            .replace('mm', '(?<minutes>\\d{2})')
            .replace('ss', '(?<seconds>\\d{2})');

        const match = value.match(new RegExp(regex));
        if (!match?.groups) return null;

        const year = parseInt(match.groups.year ?? '0');
        const month = parseInt(match.groups.month ?? '1') - 1;
        const day = parseInt(match.groups.day ?? '1');
        const hours = parseInt(match.groups.hours ?? '0');
        const minutes = parseInt(match.groups.minutes ?? '0');
        const seconds = parseInt(match.groups.seconds ?? '0');

        return new Date(year, month, day, hours, minutes, seconds);
    }

    isEmpty(value:string|null) {
        if(utils.isNullOrEmpty(value) || value == '0000-00-00') {
            return true;
        }

        return false;
    }
}
export var datetime = new DateTime();