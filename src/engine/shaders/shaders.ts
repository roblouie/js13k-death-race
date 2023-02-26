// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const var_ACOORDS = "A"
export const var_ADEPTH = "D"
export const var_ANORMAL = "C"
export const var_APERINSTANCEMATRIX = "M"
export const var_APERINSTANCENORMALMATRIX = "L"
export const var_ATEXCOORD = "z"
export const var_COLOR = "e"
export const var_EMISSIVE = "t"
export const var_MODELVIEWPROJECTION = "G"
export const var_NORMALMATRIX = "F"
export const var_OUTCOLOR = "o"
export const var_TEXTUREREPEAT = "f"
export const var_USAMPLER = "h"
export const var_U_SKYBOX = "d"
export const var_U_VIEWDIRECTIONPROJECTIONINVERSE = "I"
export const var_VCOLOR = "v"
export const var_VDEPTH = "i"
export const var_VNORMAL = "m"
export const var_VNORMALMATRIX = "n"
export const var_VTEXCOORD = "l"
export const var_V_POSITION = "H"
export const var_VIEWPROJECTION = "K"

export const fragment_glsl = `#version 300 es
precision highp float;
in vec4 v;in vec2 l;in float i;in vec3 m;in mat4 n;uniform vec2 f;uniform vec4 e,t;uniform mediump sampler2DArray h;out vec4 o;vec3 s=vec3(-1,2,1);void main(){vec3 v=normalize(mat3(n)*m),d=normalize(s);float z=max(dot(d,v),0.);vec3 A=length(t)>0.?t.xyz:e.xyz*.4f+z*e.xyz*.7;vec4 C=vec4(A,e.w);o=i<0.?C:texture(h,vec3(l*f,i))*C;}`

export const instanced_vertex_glsl = `#version 300 es
layout(location=0) in vec3 A;layout(location=1) in vec3 C;layout(location=2) in vec2 z;layout(location=3) in float D;layout(location=4) in mat4 M;layout(location=8) in mat4 L;uniform mat4 K;out vec2 l;out float i;out vec3 m;out mat4 n;void main(){vec4 v=vec4(A,1);gl_Position=K*M*v;l=z;i=D;m=C;n=L;}`

export const skybox_fragment_glsl = `#version 300 es
precision highp float;
uniform samplerCube d;uniform mat4 I;in vec4 H;out vec4 o;void main(){vec4 v=I*H;o=texture(d,v.xyz);}`

export const skybox_vertex_glsl = `#version 300 es
layout(location=0) in vec4 A;out vec4 H;void main(){H=A;gl_Position=A;gl_Position.z=1.;}`

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 A;layout(location=1) in vec3 C;layout(location=2) in vec2 z;layout(location=3) in float D;uniform mat4 G,F;out vec2 l;out float i;out vec3 m;out mat4 n;void main(){vec4 v=vec4(A,1);gl_Position=G*v;l=z;i=D;m=C;n=F;}`

