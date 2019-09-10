import {shaderManager} from "../ShaderManager";

const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

const Fluxay = {
    name: 'Fluxay',
    params: [
        { name: 'time', type: renderer.PARAM_FLOAT, defaultValue: 0 },
    ],

    start() {
        this._time = 0;
    },

    update(sprite, material, dt) {
        this._time += dt;
        if (this._time >= 1.414) {
            this._time = 0;
        }
        material.setParamValue('time', this._time);
    },

    defines:[],

    vert: `
    uniform mat4 viewProj;
    uniform mat4 model;
    attribute vec3 a_position;
    attribute vec2 a_uv0;
    varying vec2 uv0;
    void main () {
        mat4 mvp;
        mvp = viewProj * model;
        vec4 pos = mvp * vec4(a_position, 1);
        gl_Position = pos;
        uv0 = a_uv0;
    }`,

    frag:
        `uniform sampler2D texture;
        uniform vec4 color;
        uniform float time;
        varying vec2 uv0;
        
        void main()
        {
            vec4 src_color = color * texture2D(texture, uv0).rgba;
        
            float width = 0.03;       //流光的宽度范围 (调整该值改变流光的宽度)
            float start = tan(time/1.414);  //流光的起始x坐标
            float strength = 0.05;   //流光增亮强度   (调整该值改变流光的增亮强度)
            float offset = 0.5;      //偏移值         (调整该值改变流光的倾斜程度)
            if(uv0.x < (start - offset * uv0.y) &&  uv0.x > (start - offset * uv0.y - width))
            {
                vec3 improve = strength * vec3(255, 255, 255);
                vec3 result = improve * vec3( src_color.r, src_color.g, src_color.b);
                gl_FragColor = vec4(result, src_color.a);
        
            }else{
                gl_FragColor = src_color;
            }
        }`,
};

const Flash = {
    name: 'Flash',
    params: [
        { name: 'time', type: renderer.PARAM_FLOAT, defaultValue: 0 },
        { name: 'lerp', type: renderer.PARAM_FLOAT, defaultValue: 1 },
    ],

    start() {
        this._time = 0;
    },

    update(sprite, material, dt) {
        this._time += dt;
        if (this._time >= 1.414) {
            this._time = 0;
        }
        material.setParamValue('time', this._time);
    },

    setFloat(name, value, material) {
        material.setParamValue(name, value);
    },

    defines:[],

    vert: `
    uniform mat4 viewProj;
    uniform mat4 model;
    attribute vec3 a_position;
    attribute vec2 a_uv0;
    varying vec2 uv0;
    void main () {
        mat4 mvp;
        mvp = viewProj * model;
        vec4 pos = mvp * vec4(a_position, 1);
        gl_Position = pos;
        uv0 = a_uv0;
    }`,

    frag:
        `uniform sampler2D texture;
        uniform vec4 color;
        uniform float time;
        uniform float lerp;
        varying vec2 uv0;
        
        void main()
        {
            vec3 flashColor = vec3(1.,1.,1.);
            vec4 src_color = color * texture2D(texture, uv0).rgba;
            vec3 result = mix(flashColor, src_color.rgb, lerp);
            gl_FragColor = vec4(result.rgb, src_color.a);
        }`,
};

const Gray = {
    name: 'Gray',

    defines:[],

    vert: `
    uniform mat4 viewProj;
    uniform mat4 model;
    attribute vec3 a_position;
    attribute vec2 a_uv0;
    varying vec2 uv0;
    void main () {
        mat4 mvp;
        mvp = viewProj * model;
        vec4 pos = mvp * vec4(a_position, 1);
        gl_Position = pos;
        uv0 = a_uv0;
    }`,

    frag:
        `uniform sampler2D texture;
    uniform vec4 color;
    uniform float bGray;
    varying vec2 uv0;
    void main()
    {
        vec4 c = color * texture2D(texture, uv0);
        float gray = 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;
        gl_FragColor = vec4(gray, gray, gray, c.a);
    }`,
};

const Normal={
    name: 'Normal',

    defines:[],

    vert: `
    uniform mat4 viewProj;
    uniform mat4 model;
    attribute vec3 a_position;
    attribute vec2 a_uv0;
    varying vec2 uv0;
    void main () {
        mat4 mvp;
        mvp = viewProj * model;
        vec4 pos = mvp * vec4(a_position, 1);
        gl_Position = pos;
        uv0 = a_uv0;
    }`,

    frag:
        `uniform sampler2D texture;
        uniform vec4 color;
        varying vec2 uv0;
        void main () {
            vec4 c = color * texture2D(texture, uv0);
            gl_FragColor = c;
        }`, 
}


shaderManager.addShader(Fluxay);
shaderManager.addShader(Gray);
shaderManager.addShader(Normal);
shaderManager.addShader(Flash);