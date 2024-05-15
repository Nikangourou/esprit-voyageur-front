"use client";

import styles from "./loadShader.module.scss";
import { useRef, useEffect } from "react";
import { fragmentShader, vertexShader } from "./shader/shader";
import { gsap } from "gsap";
import * as THREE from "three";
import { useSelector } from "react-redux";

const LoaderShader = () => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef();
  const startTimeRef = useRef(Date.now()); // Stocker le temps de départ
  const sceneRef = useRef(); // Stocker le temps de départ
  const cameraRef = useRef(); // Stocker le temps de départ
  const meshRef = useRef(); // Stocker le temps de départ

  const shaderPosition = useSelector((state) => state.game.shaderPosition);

  const handleResize = () => {
    const pixelRatio = window.devicePixelRatio;
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // Mise à jour de la résolution du shader
    materialRef.current.uniforms.uResolution.value.x = newWidth * pixelRatio;
    materialRef.current.uniforms.uResolution.value.y = newHeight * pixelRatio;

    // Mise à jour de la taille du renderer
    if (rendererRef.current) {
      rendererRef.current.setSize(newWidth, newHeight);
    }
  };

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
          value: 1,
        },
        uColor: {
          value: new THREE.Vector3(1, 1, 0),
        },
        uOffset: {
          value: new THREE.Vector2(Math.random() * 3, Math.random() * 3),
        },
        uResolution: {
          value: new THREE.Vector2(
            window.innerWidth * pixelRatio,
            window.innerHeight * pixelRatio
          ),
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
        width: window.innerWidth,
        height: window.innerHeight,
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
      window.addEventListener("resize", handleResize);
      update();
    }
    return () => {
      cancelAnimationFrame(requestAnimationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (materialRef.current && materialRef.current.uniforms.uProgress) {
      gsap.to(materialRef.current.uniforms.uProgress, {
        value: shaderPosition,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
          }
        },
      });
    }
  }, [shaderPosition]);

  return (
    <div className={styles.LoaderShader}>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        style={{ width: "100svw", height: "100svh", background: "transparent" }}
      ></canvas>
    </div>
  );
};

export default LoaderShader;
