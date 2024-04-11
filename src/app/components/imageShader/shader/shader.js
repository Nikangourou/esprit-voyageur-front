const functionsNoise = `
 float cnoise(vec3 P){
        vec3 Pi0 = floor(P); // Integer part for indexing
        vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
        Pi0 = mod(Pi0, 289.0);
        Pi1 = mod(Pi1, 289.0);
        vec3 Pf0 = fract(P); // Fractional part for interpolation
        vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;
    
        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);
    
        vec4 gx0 = ixy0 / 7.0;
        vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    
        vec4 gx1 = ixy1 / 7.0;
        vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    
        vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
        vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
        vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
        vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
        vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
        vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
        vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
        vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
    
        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x;
        g010 *= norm0.y;
        g100 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x;
        g011 *= norm1.y;
        g101 *= norm1.z;
        g111 *= norm1.w;
    
        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);
    
        vec3 fade_xyz = fade(Pf0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
        return 2.2 * n_xyz;
    }
    
    float fbm(vec3 x) {
        float v = 0.0;
        float a = 0.5;
        vec3 shift = vec3(100);
        for (int i = 0; i < 2; ++i) {
            v += a * cnoise(x);
            x = x * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }   
`;

const functionsVoronoi = `


vec2 hash2(vec2 p)
{
       // Dave Hoskin's hash as in https://www.shadertoy.com/view/4djSRW
       vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
       p3 += dot(p3, p3.yzx+19.19);
       vec2 o = fract(vec2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));

    #ifdef ANIMATE
       o = 0.5 + 0.5*sin( uTime*0.0001 + o*6.2831853 );
    #endif
   return o;
}


//---------------------------------------------------------------
// 4x4 scan in both passes = most accurate
//---------------------------------------------------------------

vec3 voronoi( in vec2 x )
{
#if 1
    // slower, but better handles big numbers
    vec2 n = floor(x);
    vec2 f = fract(x);
    vec2 h = step(.5,f) - 2.;
    n += h; f -= h;
#else
    vec2 n = floor(x - 1.5);
    vec2 f = x - n;
#endif

    //----------------------------------
    // first pass: regular voronoi
    //----------------------------------
 vec2 mr;

    float md = 8.0;
    for( int j=0; j<=3; j++ )
    for( int i=0; i<=3; i++ )
    {
        vec2 g = vec2(float(i),float(j));
        vec2 o = hash2( n + g );
        vec2 r = g + o - f;
        float d = dot(r,r);

        if( d<md )
        {
            md = d;
            mr = r;
        }
    }

    //----------------------------------
    // second pass: distance to borders
    //----------------------------------
    md = 8.0;
    for( int j=0; j<=3; j++ )
    for( int i=0; i<=3; i++ )
    {
        vec2 g = vec2(float(i),float(j));
        vec2 o = hash2( n + g );
        vec2 r = g + o - f;

        if( dot(mr-r,mr-r)>EPSILON ) // skip the same cell
        md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
    }

    return vec3( md*uProgress, mr );
}

vec3 plot( vec2 p, float ss )
{
    vec3 c = voronoi( p*2.66 ) ;
    
    float d = length(c.yz);
    float n = c.r * (1.- d);
    float e = step(uProgressDistord,n);
    vec3 col = vec3(e);
    return col;
}

`;

export const fragmentShader = `
    precision highp float;
    
    #define SECOND_PASS 2

    #define ANIMATE
    
    // How far cells can go off center during animation (must be <= .5)
    #define ANIMATE_D .5
    
    // Points cannot be closer than sqrt(EPSILON)
    #define EPSILON .00001
    
    varying vec2 vUv;

    uniform sampler2D uImage;
    uniform sampler2D uVoronoi;
    
    uniform float uTime;
    uniform float uProgressDistord;
    uniform float uProgress;
    uniform float uProgressBlur;

    //Classic Perlin 3D Noise 
    //by Stefan Gustavson
    //
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
    float luminence(vec3 rgb){
        return dot(rgb,vec3(.299,.587,.144));
    }
    
        float random(vec2 st){
        return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
    }
    
    void applyGlass(out vec2 uv, in float noise){
            uv.x += (random(uv.xy)*2. - 1.) *.05 * uProgressBlur + noise * uProgressBlur;
    }
    

    
    ${functionsNoise}
    
    ${functionsVoronoi} 
    
    void main() {
        vec2 textureCoord = (vUv-.5)*1.15+.5 ;
        vec2 textureCoord1 = (vUv-.5)*1.15+.5;
        
        float additionnalTime = (uProgressBlur) * .0035;
        float additionnalAmplitude = ( uProgressBlur) * 5.5;
        
        float borderNoise = fbm(vec3(textureCoord*(7.5+additionnalAmplitude),uTime*(.002+additionnalTime)) ) * (5.5 + additionnalAmplitude);
        float innerNoise =  fbm(vec3(textureCoord1*3.5,uTime*.00175) ) * 35.5;
        
        vec2 tmpTextureCoord = textureCoord;
        applyGlass(tmpTextureCoord,innerNoise*.005);
        
        vec4 text =  texture2D(uImage, tmpTextureCoord + vec2(innerNoise*.001));
        vec4 textVoronoi =  texture2D(uVoronoi, textureCoord1);

   
        // Apply border noise
        textureCoord = textureCoord + vec2(borderNoise) * .025;
        vec2 tmpUv = vec2(textureCoord1.x ,textureCoord1.y) ;

        float circle = distance(textureCoord,vec2(0.5));
        circle = 1. - step(.44,circle);
        
        
        vec3 voronoi = plot( tmpUv + innerNoise*.0075,0.001);
        vec4 finalText =  text * circle *  vec4(voronoi,voronoi.x) ;
        
        vec3 final = finalText.rgb;
        final = mix(final,vec3(luminence(final)),uProgressBlur);
        
        float testVoronoi = voronoi.x;
        
        
        gl_FragColor = vec4(final*circle*voronoi.r+(1.-voronoi.r),abs(circle))   ;
        // gl_FragColor = vec4(voronoi,1.)  ;
        // gl_FragColor = vec4(1.,0.,0.,1.);
        // gl_FragColor = finalText * (innerNoise)  ;
    }
`;

export const vertexShader = `
varying vec2 vUv;
uniform float uTime;

void main() {

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
    vUv = uv;
}
`;
