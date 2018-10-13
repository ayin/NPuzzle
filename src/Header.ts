class Header extends eui.Group {
    private static instance: Header;
    public static getInstance(): Header {
        if (this.instance == null) {
            this.instance = new Header();
        }
        return this.instance;
    }

    private btnBack: eui.Button;
    private title: eui.Label;
    public constructor() {
        super();
        this.percentWidth = 100;
        this.height = 100;
        this.addChild(UiUtils.getRoundRect(Global.ROOT_STAGE.stageWidth, 100, 0x003333, 0.8, 10));

        this.title = new eui.Label();
        this.title.percentHeight = 100;
        this.title.percentWidth = 100;
        this.title.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.title.textAlign = egret.HorizontalAlign.CENTER;

        this.addChild(this.title);

        this.btnBack = new eui.Button();
        this.btnBack.skinName = "resource/skins/BtnBackSkin.exml";
        this.btnBack.icon = "backward_png";
        this.addChild(this.btnBack);
    }

    public setTitle(title: string): Header {
        this.title.text = title;
        return this;
    }

    public showIcon(visible: boolean): Header {
        this.btnBack.visible = visible;
        return this;
    }

    public setListener(listener, that) {
        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, listener, that);
    }
}