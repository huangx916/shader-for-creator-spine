import ShaderComponent from "./ShaderComponent";

const { ccclass, property, requireComponent, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
@requireComponent(ShaderComponent)
export default class FlashComponent extends cc.Component {

    @property(Number)
    public duration: number = 1;
    private flashPoint = 0;
    private flashTime = 0;

    private shaderComp: ShaderComponent = null;

    start()
    {
        this.shaderComp = this.node.getComponent(ShaderComponent);
        this.flashPoint = this.duration/2;

        this.shaderComp.setFloat("lerp", 1);
    }

    update(dt)
    {
        if(this.flashTime > 0)
        {
            this.flashTime -= dt;
            this.flashTime = this.flashTime < 0 ? 0 : this.flashTime;
            let rate = Math.abs(this.flashTime - this.flashPoint)*2/this.duration;
            cc.log(rate);
            this.shaderComp.setFloat("lerp", rate);
        }
    }

    public playFlash()
    {
        this.flashTime = this.duration;
    }

}