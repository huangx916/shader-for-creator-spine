const renderEngine = cc.renderer.renderEngine;
const Material = renderEngine.Material;

export class ShaderMaterial extends Material {
    constructor(shader : any) {
        super(false);

        let renderer = renderEngine.renderer;
        let gfx = renderEngine.gfx;

        let pass = new renderer.Pass(shader.name);
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
        );

        let techParams = [
            { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
            { name: 'color', type: renderer.PARAM_COLOR4 }
        ];
        if (shader.params) {
            techParams = techParams.concat(shader.params);
        }
        let mainTech = new renderer.Technique(
            ['transparent'],
            techParams,
            [pass]
        );

        this._texture = null;
        this._color = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
        this._effect = new renderer.Effect([mainTech], {}, []);
        this._mainTech = mainTech;
    }

    get effect() {
        return this._effect;
    }

    set texture(val) {
        if (this._texture !== val) {
            this._texture = val;
            this._effect.setProperty('texture', val.getImpl());
            this._texIds['texture'] = val.getId();
        }
    }

    set color(val) {
        this._color.r = val.r / 255;
        this._color.g = val.g / 255;
        this._color.b = val.b / 255;
        this._color.a = val.a / 255;
        this._effect.setProperty('color', this._color);
    }

    setParamValue(name, value) {
        this._effect.setProperty(name, value);
    }
    getParamValue(name) {
        return this._effect.getProperty(name);
    }
    setDefine(name, value) {
        this._effect.define(name, value);
    }
}