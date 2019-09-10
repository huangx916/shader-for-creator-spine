import {shaderManager, ShaderType} from "./ShaderManager";
import {ShaderMaterial} from "./ShaderMaterial";
import ShaderController from "./ShaderController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShaderComponent extends cc.Component {

    @property({ type: cc.Enum(ShaderType)})
    shaderType: ShaderType = ShaderType.Default;
    @property()
    playOnLoad: boolean = false;

    applyFlag : boolean = false;
    shaderObj : any = null;
    shaderMaterial : ShaderMaterial = null;

    onLoad() {
        this.playOnLoad && this.applyShader(this.shaderType);
    }

    start()
    {
    }

    getApplyNode () {
        return this.getComponent(cc.Sprite) || this.getComponent(sp.Skeleton);
    }

    update(dt : number) {
        /*if (CC_EDITOR || !this.applyFlag) {
            return;
        }*/
        if (this.shaderObj && this.shaderObj.update) {
            this.shaderObj.update(this.getApplyNode(), this.shaderMaterial, dt);
        }
    }

    setFloat(name, value)
    {
        if (this.shaderObj && this.shaderObj.setFloat) {
            this.shaderObj.setFloat(name, value, this.shaderMaterial);
        }
    }

    applyShader(type:ShaderType) {
        this.shaderType=type;

        this.createShader();
        /*if (!this.shaderObj || this.applyFlag || !this.shaderMaterial) {
            return;
        }
        this.applyFlag = true;*/

        if(!this.shaderMaterial)
        {
            console.error("material is null.");
            return;
        }

        let sp = this.getApplyNode() as any;
        let texture = sp.skeletonData.textures[0];
        if (this.shaderMaterial.texture !== texture) {
            this.shaderMaterial.texture = texture;
            sp._updateMaterial(this.shaderMaterial);
        } else if (this.shaderMaterial !== sp._material) {
            sp._updateMaterial(this.shaderMaterial);
        }
        if (sp._renderDatas) {
            sp._renderDatas.forEach(renderData => renderData.material = this.shaderMaterial);
        }
        sp.markForUpdateRenderData(true);
        sp.markForRender(true);

        if (this.shaderObj.params) {
            this.shaderObj.params.forEach((item) => {
                if (item.defaultValue !== undefined) {
                    this.shaderMaterial.setParamValue(item.name, item.defaultValue);
                }
            });
        }
        if (this.shaderObj.start) {
            this.shaderObj.start(this.getApplyNode(), this.shaderMaterial);
        }
    }

    createShader() {
        this.shaderObj = shaderManager.getShaderByType(this.shaderType);
        let sp = this.getApplyNode() as any;
        /*if (CC_EDITOR || !this.shaderObj || this.shaderMaterial) {
            return;
        }*/
        if(!this.shaderObj)
        {
            console.error("shader not found.");
            return;
        }

        this.shaderMaterial = shaderManager.createShaderMaterial(sp, this.shaderType);
        if (sp.node) {
            this.shaderMaterial.color = sp.node.color;
        }
        if (sp.skeletonData) {
            this.shaderMaterial.texture = sp.skeletonData.textures[0];
        }
    }

}