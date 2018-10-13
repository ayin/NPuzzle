class UiUtils {
    public static getRect(width: number = 640, height: number = 960, color: number = 0x000000, alpha: number = 0.7): egret.Shape {
        var shp: egret.Shape = new egret.Shape();
        shp.graphics.beginFill(color, alpha);
        shp.graphics.drawRect(0, 0, width, height);
        shp.graphics.endFill();
        shp.touchEnabled = false;
        return shp;
    }

    public static getRoundRect(width: number = 640, height: number = 960, color: number = 0x000000, alpha: number = 1, ellipse: number = 2): egret.Shape {
        var shp: egret.Shape = new egret.Shape();
        shp.graphics.beginFill(color, alpha);
        shp.graphics.drawRoundRect(0, 0, width, height, ellipse);
        shp.graphics.endFill();
        shp.touchEnabled = false;
        return shp;
    }

    public static createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    public static getBitmap(name: string, width: number = 0, height: number = 0): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        if (width > 0) result.width = width;
        if (height > 0) result.height = height;
        return result;
    }

    public static getImage(name: string, width: number = 0, height: number = 0): eui.Image {
        var image = new eui.Image();
        image.source = name;
        if (width > 0) image.width = width;
        if (height > 0) image.height = height;
        return image;
    }
}