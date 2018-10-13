class Dialog extends eui.Component {
    constructor() {
        super();
        this.verticalCenter = this.horizontalCenter = 0;
    }
    public titleDisplay: eui.Label;
    private _title: string;
    public closeBtn: eui.Image;
    public header: eui.Group;
    private closeCallback;
    public info: eui.Label;

    protected childrenCreated(): void {
        super.childrenCreated();
        if (this.titleDisplay) {
            this.titleDisplay.text = this._title;
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
        }
    }
    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
        if (this.titleDisplay) {
            this.titleDisplay.text = value;
        }
    }

    public set content(view: eui.UIComponent) {
        this.addChild(view);
        view.horizontalCenter = 0;
        if (this.header) {
            view.top = this.header.height + 40;
            view.bottom = 20;
        }
        let scaleX = 1, scaleY = 1;
        let maxHeight = 600;
        if (view.height + this.header.height + 60 > maxHeight) {
            scaleY = (maxHeight - this.header.height - 60) / view.height;
        }
        if (view.width > this.width - 40) {
            scaleX = (this.width - 40) / view.width;
        }
        let scale = Math.min(scaleX, scaleY);
        view.scaleX = scale;
        view.scaleY = scale;
    }

    public closeDialog() {
        if (this.closeCallback) {
            this.closeCallback();
        }
    }

    public onClose(fun) {
        this.closeCallback = fun;
    }
}