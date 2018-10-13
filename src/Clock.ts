class Clock {
    private callback;
    private t: number = 0;
    private timer;
    constructor(fun) {
        this.callback = fun;
        this.t = 0;
    }

    public start() {
        this.resume();
    }

    public pause() {
        clearInterval(this.timer);
    }

    public resume() {
        this.timer = setInterval(() => { this.t++; this.callback(this.t); }, 1000);
    }

    public reset() {
        this.t = 0;
    }

    public get time(): number {
        return this.t;
    }
}