const functionsNoise = `
float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  
  // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
  
  // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
  
    //  x0 = x0 - 0. + 0.0 * C 
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;
  
  // Permutations
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  
  // Gradients
  // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;
  
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)
  
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
  
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
  
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
  
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
  
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
  
  //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
  
  // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }
    
  #define NUM_OCTAVES 5

  float fbm(vec3 x) {
	float v = 0.0;
	float a = 0.5;
	vec3 shift = vec3(100);
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * snoise(x);
		x = x * .78 + shift;
		a *= .65;
	}
	return v;
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
    
    uniform float uTime;
    uniform float uProgress;
    uniform vec3 uColor;
    uniform float uOffset;
    uniform vec2 uResolution;
    uniform vec2 uDistanceCircle ;

    //Classic Perlin 3D Noise 
    //by Stefan Gustavson
    //
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
    float luminence(vec3 rgb){
        return dot(rgb,vec3(.299,.587,.144));
    }  
    
    ${functionsNoise}
    
float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

    void main() {
        vec2 uv = gl_FragCoord.xy/uResolution.xy;
        //vec2 uv = vUv * uResolution;

    vec2 nUv = uv;
    nUv *= 5.;
    float n = snoise(vec3(nUv ,uTime *.15)) ;
    
    vec2 dUv = vec2(uv.x,uv.y)-.5;
    dUv.x *= uDistanceCircle.x;
    dUv.y *= uDistanceCircle.y; 
    dUv.y += uOffset;
    
    float dist = sdBox(dUv,vec2(.05));
    float n2 = snoise(vec3(dUv*3.5,uTime *.25)) * .1;
    n2 += n2*0.1;
    dist += (n2+n)*.1;
    dist = smoothstep(.0,.3,dist);

    n = n*fbm(vec3(n*.01))*7.5+distance(uv,vec2(.5))*.767;


    float n0 = step(.45, n);
    float n01 = step(.35, n-n0);
 
    float n3 = step(.2, n);
    float n03 = step(.05, n-n3);


    vec3 nVec = vec3(n01) * vec3(0.,0.,0.);
    nVec += vec3(n03) * uColor;

    float alpha = n01+n03;
    
    
    //TO COMMENT to get full
    nVec -= ((1.-dist)*12.5 * uProgress);
    alpha -= ((1.-dist)*12.5 * uProgress);
    nVec = step(vec3(0.1),nVec);
    alpha = step(0.1,alpha);

    
 
    
    vec4 final = vec4(nVec,alpha);
    gl_FragColor = final;
        
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
