export function getData(key: string): string | null {
    return localStorage.getItem(key);
}

export function saveData(key: string, value: string | number): void {
    localStorage.setItem(key, String(value));
}

export function removeData(key: string): void {
    localStorage.removeItem(key);
}
