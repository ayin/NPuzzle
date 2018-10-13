class GameManager {
    private static instance: GameManager;
    public static getInstance(): GameManager {
        if (this.instance == null) {
            egret.ExternalInterface.addCallback("onKeyBack", str => {
                GameManager.getInstance().back();
            });
            this.instance = new GameManager();
        }
        return this.instance;
    }


    public static ROOT: eui.UILayer;
    private header: Header;
    private body: eui.Group;
    private constructor() {
        let text = Global.TEXT;
        Global.MENU = [
            {
                "name": text["menu_number"],
                "levels": ["4 x 4", "5 x 5", "6 x 6", "7 x 7", "8 x 8"]
            },
            {
                "name": text["menu_chinese_poet"],
                "levels": [text["menu_JUE5"], text["menu_JUE7"], text["menu_LU5"], text["menu_LU7"]]
            },
            {
                "name": text["menu_alphabet"],
                "levels": [text["menu_lowercase"], text["menu_uppercase"], text["menu_mixed"]]
            },
            {
                "name": text["menu_fixed"],
                "levels": ["5 x 4", "5 x 5", "6 x 6", "7 x 7", "8 x 8"]
            }
        ];

        this.header = new Header();
        this.header.setListener(this.back, this);
        let body = new eui.Group();
        body.percentWidth = 100;
        body.percentHeight = 100;
        body.top = 100;
        this.body = body;

        let root: eui.UILayer = GameManager.ROOT;
        root.addChild(this.header.showIcon(false));
        root.addChild(body);
    }

    private page: number;
    private index1: number;
    private index2: number;

    public showSelect1(): void {
        this.page = 1;
        this.header.showIcon(false).setTitle(Global.TEXT["app_name"]);
        this.body.removeChildren();
        this.body.addChild(new Select1());
    }

    public showSelect2(index: number): void {
        this.page = 2;
        this.index1 = index;
        this.header.showIcon(true).setTitle(Global.MENU[index].name);
        this.body.removeChildren();
        this.body.addChild(new Select2(index));
    }

    public showBoard(index: number): void {
        this.page = 3;
        this.index2 = index;
        this.header.showIcon(true);
        this.body.removeChildren();
        let name = Global.MENU[this.index1].name;
        let data: [number, number, string[], string] = this.getData(name, Global.MENU[this.index1].levels[this.index2]);
        this.header.setTitle(data[3]);
        this.body.addChild(new Board(data[0], data[1], data[2], name == Global.TEXT["menu_fixed"]));
    }

    private lowCase = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "", "r", "s", "t", "u", "v", "w", "", "x", "y", "z"];
    private upperCase = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "", "R", "S", "T", "U", "V", "W", "", "X", "Y", "Z"];
    private getData(name: string, level: string): [number, number, string[], string] {
        if (name == Global.TEXT["menu_alphabet"]) {
            if (level == Global.TEXT["menu_lowercase"]) {
                return [7, 4, this.lowCase, name + ":" + level];
            } else if (level == Global.TEXT["menu_uppercase"]) {
                return [7, 4, this.upperCase, name + ":" + level];
            } else if (level == Global.TEXT["menu_mixed"]) {
                return [7, 8, this.lowCase.concat(this.upperCase), name + ":" + level];
            }
        }
        if (name == Global.TEXT["menu_chinese_poet"]) {
            if (level == Global.TEXT["menu_JUE5"]) {
                let a = this.getPoet("JUE5");
                return [5, 4, a[0], a[1]];
            } else if (level == Global.TEXT["menu_JUE7"]) {
                let a = this.getPoet("JUE7");
                return [7, 4, a[0], a[1]];
            } else if (level == Global.TEXT["menu_LU5"]) {
                let a = this.getPoet("LU5");
                return [5, 8, a[0], a[1]];
            } else if (level == Global.TEXT["menu_LU7"]) {
                let a = this.getPoet("LU7");
                return [7, 8, a[0], a[1]];
            }
        }
        if (level == "4 x 4") {
            return [4, 4, this.getNumbers(16), Global.MENU[this.index1].name + ":" + level];
        } else if (level == "5 x 5") {
            return [5, 5, this.getNumbers(25), Global.MENU[this.index1].name + ":" + level];
        } else if (level == "6 x 6") {
            return [6, 6, this.getNumbers(36), Global.MENU[this.index1].name + ":" + level];
        } else if (level == "7 x 7") {
            return [7, 7, this.getNumbers(49), Global.MENU[this.index1].name + ":" + level];
        } else if (level == "8 x 8") {
            return [8, 8, this.getNumbers(64), Global.MENU[this.index1].name + ":" + level];
        } else if (level == "5 x 4") {
            return [5, 4, this.getNumbers(20), Global.MENU[this.index1].name + ":" + level];
        }
    }


    private getAlphaBet(size: number): string[] {
        let rst: string[] = [];
        for (let i = 0; i < Math.min(size, 26); i++) {
            rst[i] = String.fromCharCode("a".charCodeAt(0) + i);
        }
        for (let i = 26; i < Math.min(size, 52); i++) {
            rst[i] = String.fromCharCode("A".charCodeAt(0) + i - 26);
        }
        return rst;
    }

    private getNumbers(size: number): string[] {
        let rst: string[] = [];
        for (let i = 0; i < size; i++) {
            rst[i] = "" + (i + 1);
        }
        return rst;
    }

    private getPoet(type: string): [string[], string] {
        let poet = POET[type][CommonUtils.random(0, POET[type].length)];
        let str: string[] = poet.content.split("");
        return [str, poet.title];
    }

    public showDialog(view, cb) {
        let __bg = UiUtils.getRect(GameManager.ROOT.width, GameManager.ROOT.height, 0x000000, 0.8);
        __bg.touchEnabled = true;
        GameManager.ROOT.addChild(__bg);
        let dialog: Dialog = new Dialog();
        dialog.title = Global.TEXT["description"];
        GameManager.ROOT.addChild(dialog);
        if (view) {
            dialog.content = view;
        }
        dialog.info.text = Global.TEXT["detail"];
        dialog.onClose(() => {
            GameManager.ROOT.removeChild(__bg);
            GameManager.ROOT.removeChild(dialog);
            cb();
        });
    }

    public back() {
        if (this.page == 1) {
            if (egret.Capabilities.isMobile) {
                egret.ExternalInterface.call("exit", "exit");
            }
            return;
        } else if (this.page == 2) {
            this.showSelect1();
        } else if (this.page == 3) {
            this.showSelect2(this.index1);
        }
    }
}