enum STATUS { NORMAL, EMPTY, FIXED }
enum DIR { DOWN, UP, LEFT, RIGHT }

class Cell {
    info: string;
    status: STATUS;
    visible: boolean;
    color: number;
    public constructor(status, info) {
        this.info = info;
        this.status = status;
        this.visible = true;
        this.color = this.isEmpty() ? 0xFFFFFF : 0x034567;
        if (info == "") {
            this.color = 0x998876;
            this.status = STATUS.FIXED;
        }
    }

    public copy(): Cell {
        let c: Cell = new Cell(this.status, this.info);
        c.visible = this.visible;
        c.color = this.color;
        return c;
    }

    public isEmpty(): boolean {
        return this.status == STATUS.EMPTY;
    }

    public isFixed(): boolean {
        return this.status == STATUS.FIXED;
    }

    public updateVisiable(last: boolean) {
        if (!this.isEmpty()) {
            return;
        }
        this.visible = last;
    }

    public setFixed() {
        this.status = STATUS.FIXED;
        this.color = 0x667788;
    }
}

class Board extends eui.Group {
    private w: number;
    private h: number;
    private origin: eui.ArrayCollection = new eui.ArrayCollection();
    private shuffle: eui.ArrayCollection = new eui.ArrayCollection();
    private step: number;
    private textStep: eui.Label;
    private clock: Clock;

    public constructor(w: number, h: number, data: string[], special: boolean) {
        super();
        this.w = w;
        this.h = h;
        this.percentWidth = 100;
        this.percentHeight = 100;
        this.horizontalCenter = 0;

        let r = (w <= 4 || h <= 4) ? 1 : 2;
        let r0 = CommonUtils.random(0, w * h - 1);
        let r1 = r == 1 ? r0 : CommonUtils.random(0, w * h - 1);

        for (let i = 0; i < w * h; i++) {
            let cell = new Cell(i == (w * h - 1) ? STATUS.EMPTY : STATUS.NORMAL, data[i]);
            cell.updateVisiable(i == (w * h - 1));
            if (special && i != (w * h - 1) && (i == r0 || i == r1)) {
                cell.setFixed();
            }
            this.origin.addItem(cell);
            this.shuffle.addItem(cell.copy());
        }
        this.doShuffle();
    }

    private doShuffle(): void {
        let dirs: DIR[] = [DIR.DOWN, DIR.UP, DIR.LEFT, DIR.RIGHT];
        for (let i = 0; i < 5000; i++) {
            this.doMove(dirs[CommonUtils.random(0, 4)]);
        }
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        this.addChild(this.getMenus());
        let sheet = this.getSheet(this.shuffle);
        this.addChild(sheet);

        let scaleX = 1, scaleY = 1;
        if (sheet.height > 600) {
            scaleY = 600 / sheet.height;
        }
        if (sheet.width > 600) {
            scaleX = 600 / sheet.width;
        }
        let scale = Math.min(scaleX, scaleY);
        sheet.scaleX = scale;
        sheet.scaleY = scale;
    }

    private doMove(dir: DIR): number {
        let posEmpty: number, posSwitch: number;
        let cellEmpty: Cell, cellSwitch: Cell;
        for (let i = 0; i < this.shuffle.length; i++) {
            cellEmpty = this.shuffle.getItemAt(i);
            if (cellEmpty.isEmpty()) {
                posEmpty = i;
                break;
            }
        }
        if (dir == DIR.DOWN) {
            posSwitch = posEmpty - this.w
        } else if (dir == DIR.UP) {
            posSwitch = posEmpty + this.w;
        } else if (dir == DIR.RIGHT) {
            if (posEmpty % this.w == 0) {
                return 0;
            }
            posSwitch = posEmpty - 1;
        } else if (dir == DIR.LEFT) {
            if (posEmpty % this.w == this.w - 1) {
                return 0;
            }
            posSwitch = posEmpty + 1;
        }
        if (posSwitch < 0 || posSwitch >= this.w * this.h) {
            return 0;
        }
        cellSwitch = this.shuffle.getItemAt(posSwitch);
        if (cellSwitch.isFixed()) {
            return 0;
        }

        cellEmpty.updateVisiable(posSwitch == (this.w * this.h - 1));
        this.shuffle.replaceItemAt(cellSwitch, posEmpty);
        this.shuffle.replaceItemAt(cellEmpty, posSwitch);
        return 1;
    }

    private doMove2(event: egret.TouchEvent): number {
        let target: eui.ItemRenderer = event.target.parent.data;
        let posEmpty: number, posSwitch: number;
        let cellEmpty: Cell, cellSwitch: Cell;
        for (let i = 0; i < this.shuffle.length; i++) {
            let t = this.shuffle.getItemAt(i);
            if (t.isEmpty()) {
                posEmpty = i;
                cellEmpty = t;
            }
            if (t == target) {
                posSwitch = i;
                cellSwitch = t;
            }
        }
        if (posEmpty == posSwitch || posSwitch == null || cellSwitch.isFixed()) {
            return 0;
        }
        if (Math.floor(posEmpty / this.w) == Math.floor(posSwitch / this.w)) { //same row
            if ((posEmpty != posSwitch + 1) && (posSwitch != posEmpty + 1)) {
                return 0;
            }
        } else if (posEmpty % this.w == posSwitch % this.w) {//same col
            if ((posEmpty != posSwitch + this.w) && (posSwitch != posEmpty + this.w)) {
                return 0;
            }
        } else {
            return 0;
        }

        cellEmpty.updateVisiable(posSwitch == (this.w * this.h - 1));
        this.shuffle.replaceItemAt(cellSwitch, posEmpty);
        this.shuffle.replaceItemAt(cellEmpty, posSwitch);
        this.step = this.step + 1;
        this.textStep.text = Global.TEXT["step"] + this.step;
        this.checkSuccess();
        return 1;
    }

    private getMenus(): eui.Group {
        let holder = new eui.Group();
        holder.percentWidth = 100;
        holder.height = 100;
        holder.horizontalCenter = 0;

        let btnRestart = new eui.Button();
        btnRestart.skinName = "resource/skins/BtnBackSkin.exml";
        btnRestart.left = 0;
        btnRestart.icon = "restart_png";
        btnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.doShuffle();
            this.step = 0;
            this.textStep.text = Global.TEXT["step"] + this.step;
            this.clock.reset();
        }, this);
        holder.addChild(btnRestart);

        this.step = 0;
        let text1 = new eui.Label();
        text1.percentHeight = 100;
        text1.verticalAlign = egret.VerticalAlign.MIDDLE;
        text1.text = Global.TEXT["step"] + this.step;
        text1.left = 120;
        holder.addChild(text1);
        this.textStep = text1;


        let text2 = new eui.Label();
        text2.text = Global.TEXT["time"] + "00:00";
        text2.right = 120;
        text2.percentHeight = 100;
        text2.verticalAlign = egret.VerticalAlign.MIDDLE;
        holder.addChild(text2);
        this.clock = new Clock(t => text2.text = Global.TEXT["time"] + CommonUtils.formatTime(t));
        this.clock.start();

        let btnQuestion = new eui.Button();
        btnQuestion.skinName = "resource/skins/BtnBackSkin.exml";
        btnQuestion.right = 0;
        btnQuestion.icon = "Question_png";
        btnQuestion.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.clock.pause();
            GameManager.getInstance().showDialog(this.getSheet(this.origin), () => this.clock.resume());
        }, this);
        holder.addChild(btnQuestion);

        return holder;
    }

    private getSheet(data: eui.ArrayCollection): eui.Group {
        let size = 100, w = this.w, h = this.h;
        let holder = new eui.Group();
        holder.horizontalCenter = 0;
        let width = size * w + 20, height = size * h + 20;
        holder.width = width;
        holder.height = height;
        holder.addChild(UiUtils.getRoundRect(width, height, 0x998876, 1, size / 5));

        let layer2 = UiUtils.getRect(size * w + 4, size * h + 4, 0xffffff, 1)
        layer2.x = 8;
        layer2.y = 8;
        holder.addChild(layer2);

        let layer3 = new eui.Group();
        layer3.width = size * w;
        layer3.height = size * h;
        layer3.x = 10;
        layer3.y = 10;
        holder.addChild(layer3);

        var dataGroup: eui.DataGroup = new eui.DataGroup();
        dataGroup.dataProvider = data;
        dataGroup.itemRenderer = eui.ItemRenderer;
        dataGroup.touchChildren = true;
        let layout = new eui.TileLayout();
        layout.columnWidth = size;
        layout.rowHeight = size;
        layout.horizontalGap = 0;
        layout.verticalGap = 0;
        dataGroup.layout = layout;
        dataGroup.width = size * w;
        layer3.addChild(dataGroup);
        dataGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.doMove2, this, true);

        holder.y = 200;
        let preX: number;
        let preY: number;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => {
            preX = e.stageX;
            preY = e.stageY;
        }, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => {
            let curX = e.stageX, curY = e.stageY;
            let moved = 0;
            if (Math.abs(curX - preX) < 50) {
                if (curY - preY > 100) {
                    moved = this.doMove(DIR.DOWN);
                } else if (preY - curY > 100) {
                    moved = this.doMove(DIR.UP);
                }
            } else if (Math.abs(curY - preY) < 50) {
                if (curX - preX > 100) {
                    moved = this.doMove(DIR.RIGHT);
                } else if (preX - curX > 100) {
                    moved = this.doMove(DIR.LEFT);
                }
            } else if (Math.abs(curX - preX) - Math.abs(curY - preY) > 100) {
                if (curX > preX) {
                    moved = this.doMove(DIR.RIGHT);
                } else {
                    moved = this.doMove(DIR.LEFT);
                }
            } else if (Math.abs(curY - preY) - Math.abs(curX - preX) > 100) {
                if (curY > preY) {
                    moved = this.doMove(DIR.DOWN);
                } else {
                    moved = this.doMove(DIR.UP);
                }
            }
            if (moved == 1) {
                this.step = this.step + 1;
                this.textStep.text = Global.TEXT["step"] + this.step;
                e.stopImmediatePropagation();
                this.checkSuccess();
            }
        }, this, true);

        return holder;
    }

    private checkSuccess(): boolean {
        for (let i = 0; i < this.shuffle.length; i++) {
            if (this.shuffle.getItemAt(i).info != this.origin.getItemAt(i).info) {
                return false;
            }
        }
        this.showSucDialog();
    }

    public showSucDialog() {
        this.clock.pause();
        let __bg = UiUtils.getRect(GameManager.ROOT.width, GameManager.ROOT.height, 0x000000, 0.8);
        __bg.touchEnabled = true;
        GameManager.ROOT.addChild(__bg);
        let dialog: Dialog = new Dialog();
        dialog.title = Global.TEXT["suc"];
        GameManager.ROOT.addChild(dialog);

        let holder = new eui.Group();
        holder.width = 500;
        holder.height = 300;
        let label1 = new eui.Label(Global.TEXT["time"] + CommonUtils.formatTime(this.clock.time));
        label1.textColor = 0x888888;
        label1.size = 80;
        label1.percentWidth = 100;
        label1.height = 150;
        label1.verticalAlign = egret.VerticalAlign.MIDDLE;
        label1.textAlign = egret.HorizontalAlign.CENTER;
        let label2 = new eui.Label(Global.TEXT["step"] + this.step);
        label2.top = 150;
        label2.textColor = 0x888888;
        label2.size = 80;
        label2.percentWidth = 100;
        label2.height = 150;
        label2.verticalAlign = egret.VerticalAlign.MIDDLE;
        label2.textAlign = egret.HorizontalAlign.CENTER;
        holder.addChild(label1);
        holder.addChild(label2);
        dialog.content = holder;
        dialog.info.text = "";

        dialog.onClose(() => {
            GameManager.ROOT.removeChild(__bg);
            GameManager.ROOT.removeChild(dialog);
            GameManager.getInstance().back();
        });
    }
}