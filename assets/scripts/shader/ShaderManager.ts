import {ShaderMaterial} from "./ShaderMaterial";

export enum ShaderType {
    Default = 0,
    Gray,
    Fluxay = 101,
    Normal,
    Flash,
}

class ShaderManager {
    shaders : any = {};

    addShader(shader : any) {
        if (this.shaders[shader.name]) {
            return;
        }
        let renderer = cc.renderer as any;
        if (renderer._forward) {
            let lib = renderer._forward._programLib;
            !lib._templates[shader.name] && lib.define(shader.name, shader.vert, shader.frag, shader.defines || []);
            this.shaders[shader.name] = shader;
        } else {
            let gameEvent = cc.game as any;
            let thisObj = this;
            gameEvent.once(cc.game.EVENT_ENGINE_INITED, () => {
                let lib = renderer._forward._programLib;
                !lib._templates[shader.name] && lib.define(shader.name, shader.vert, shader.frag, shader.defines || []);
                thisObj.shaders[shader.name] = shader;
            });
        }
    }

    getShaderByType(type : ShaderType) {
        return this.shaders[ShaderType[type]];
    }

    createShaderMaterial(sprite : cc.Sprite | sp.Skeleton, type : ShaderType){
        if (!sprite || cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            return null;
        }
        let shader = this.getShaderByType(type);
        if (shader === null) {
            if (sprite instanceof cc.Sprite) {
                sprite.setState(shader);
            }
            return null;
        }
        return new ShaderMaterial(shader);
    }
}

export let shaderManager = new ShaderManager();