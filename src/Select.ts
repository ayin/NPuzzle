class Select1 extends eui.Group {
    public constructor() {
        super();
    }
    protected childrenCreated(): void {
        let y = 200;
        this.horizontalCenter = 0;
        for (let i = 0; i < Global.MENU.length; i++) {
            let btn = new eui.Button();
            btn.width = 500;
            btn.height = 100;
            btn.label = Global.MENU[i].name;
            btn.y = y;
            y += 120;
            this.addChild(btn);
            let that = this;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, e => {
                GameManager.getInstance().showSelect2(i);
            }, this);
        }
    }
}

class Select2 extends eui.Group {
    private level: number = 0;
    public constructor(level: number) {
        super();
        this.level = level;
    }

    protected childrenCreated(): void {
        let str = Global.MENU[this.level].levels;
        let y = 200;
        this.horizontalCenter = 0;
        for (let i = 0; i < str.length; i++) {
            let btn = new eui.Button();
            btn.width = 500;
            btn.height = 100;
            btn.label = str[i];
            btn.y = y;
            y += 120;
            this.addChild(btn);
            let that = this;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, e => {
                GameManager.getInstance().showBoard(i);
            }, this);
        }
    }
}