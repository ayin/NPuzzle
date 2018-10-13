class CommonUtils {
    //end >= start [start, end]
    public static random(start: number = 0, end: number): number {
        return Math.floor(Math.random() * (end - start)) + start;
    }

    public static formatTime(time: number): string {
        let minuter = Math.floor(time / 60), second = time % 60;
        return this.formatNumber(minuter, 2) + ":" + this.formatNumber(second, 2);
    }

    public static formatNumber(num: number, len: number): string {
        if (len == 3) {
            if (num > 999) {
                return "999";
            } else {
                return Math.floor(num / 100) + "" + Math.floor((num % 100) / 10) + "" + num % 10;
            }
        } else if (len == 2) {
            if (num > 99) {
                return "99";
            } else {
                return Math.floor(num / 10) + "" + num % 10;
            }
        }
    }
}