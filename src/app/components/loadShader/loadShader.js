"use client";

import styles from "./loadShader.module.scss";
import { useRef, useEffect } from "react";
import { fragmentShader, vertexShader } from "./shader/shader";
import { gsap } from "gsap";
import * as THREE from "three";

const LoaderShader = () => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef();
  const startTimeRef = useRef(Date.now()); // Stocker le temps de départ
  const sceneRef = useRef(); // Stocker le temps de départ
  const cameraRef = useRef(); // Stocker le temps de départ
  const meshRef = useRef(); // Stocker le temps de départ

  function createPlaneShader() {
    const pixelRatio = window.devicePixelRatio;

    const params = {
      vertexShader: vertexShader, // our vertex shader ID
      fragmentShader: fragmentShader, // our fragment shader ID
      transparent: true,
      alphaTest: 0,
      uniforms: {
        uTime: {
          value: 0,
        },
        uProgress: {
          value: 0,
        },
        uColor: {
          value: new THREE.Vector3(1., 1., 0.),
        },
        uOffset: {
          value: new THREE.Vector2(Math.random() * 3, Math.random() * 3),
        },
        uResolution: {
            value: new THREE.Vector2(window.innerWidth *pixelRatio , window.innerHeight*pixelRatio ),
        },
      },
    };

    materialRef.current = new THREE.ShaderMaterial(params);

    meshRef.current = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      materialRef.current
    );
    return meshRef.current;
  }

  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      // Scene
      rendererRef.current = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        pixelRatio: window.devicePixelRatio,
      });

      const pixelRatio = window.devicePixelRatio;
      const sizes = {
        width: window.innerWidth  ,
        height: window.innerHeight ,
      };
      rendererRef.current.setPixelRatio(pixelRatio);
      rendererRef.current.setSize(sizes.width, sizes.height);

      sceneRef.current = new THREE.Scene();

      cameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      cameraRef.current.position.z = 0;
      // camera.lookAt(new THREE.Vector3(0, - 1, 0))
      sceneRef.current.add(cameraRef.current);

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      rendererRef.current.setClearColor(0x000000, 0);
      sceneRef.current.add(createPlaneShader());

    }

    let requestAnimationId;

    if (sceneRef.current) {
    

      function update() {
        const currentTime = Date.now();
        const deltaTime = currentTime - startTimeRef.current;
        startTimeRef.current = currentTime;
        materialRef.current.uniforms.uTime.value += deltaTime * 0.0005; // Mettre à jour uTime avec le temps écoulé en secondes
        rendererRef.current.render(sceneRef.current, cameraRef.current); // Rendu de la scène
        requestAnimationId = requestAnimationFrame(update); // Appel récursif de la fonction update
      }
      // Démarrer la boucle de rendu
      update();
      
    }
    return () => {
      cancelAnimationFrame(requestAnimationId);
    };
  }, []);

  return (
    <div className={styles.LoaderShader}>
      <canvas className={styles.canvas} ref={canvasRef} style={{width: "100svw",height:"100svh",background:"transparent"}}></canvas>
    </div>
  );
};

export default LoaderShader;
