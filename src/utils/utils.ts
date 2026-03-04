export class AxSUtils {
    public static formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const parts: string[] = [];

        if (hours > 0) {
            parts.push(`${hours.toString().padStart(2, '0')}h`);
        }

        if (minutes > 0 || hours > 0) {
            parts.push(`${minutes.toString().padStart(2, '0')}m`);
        }

        parts.push(`${secs.toString().padStart(2, '0')}s`);

        return parts.join(':');
    }

    public static formatNumberIndian(value: number): string {
        return new Intl.NumberFormat('en-IN').format(value);
    }

    public static getNextMidnightInSeconds(): number {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return Math.floor(tomorrow.getTime() / 1000);
    }

    public static getDeltaTimeInSeconds(targetTimeSeconds: number): number {
        const nowSeconds = Math.floor(Date.now() / 1000);
        return targetTimeSeconds - nowSeconds;
    }
}