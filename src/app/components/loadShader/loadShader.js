"use client";

import styles from "./loadShader.module.scss";
import { useRef, useEffect, useContext } from "react";
import { fragmentShader, vertexShader } from "./shader/shader";
import { gsap } from "gsap";
import * as THREE from "three";
import { useSelector } from "react-redux";
import { CustomEase } from "gsap/CustomEase";
import { SocketContext } from "../../context/socketContext";

gsap.registerPlugin(CustomEase);

const LoaderShader = () => {
  const players = useSelector((state) => state.players.players);
  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const { materialLoaderRef } = useContext(SocketContext);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef();
  const startTimeRef = useRef(Date.now()); // Stocker le temps de départ
  const sceneRef = useRef(); // Stocker le temps de départ
  const cameraRef = useRef(); // Stocker le temps de départ
  const meshRef = useRef(); // Stocker le temps de départ
  const colorRef = useRef();
  const distanceRef = useRef();

  const shaderPosition = useSelector((state) => state.game.shaderPosition);
  const distanceCircle = useSelector((state) => state.game.distanceCircle);
  const offset = useSelector((state) => state.game.offset);

  if (typeof window === "undefined") {
    return <div></div>;
  }

  useEffect(() => {
    console.log(currentBluffer);
    const colorStyle =
      currentBluffer && currentBluffer != ""
        ? new THREE.Color(players[currentBluffer].color)
        : "";
    if (colorStyle !== "") {
      gsap.to(colorRef.current, {
        r: colorStyle.r,
        g: colorStyle.g,
        b: colorStyle.b,
        duration: 3,
        ease: "power2.out",
      });
    }
  }, [currentBluffer]);

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
    colorRef.current = new THREE.Color("blue");
    distanceRef.current = new THREE.Vector2(...distanceCircle);
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
          value: colorRef.current,
        },
        uOffset: {
          value: 0,
        },
        uDistanceCircle: {
          value: distanceRef.current,
        },
        uResolution: {
          value: new THREE.Vector2(
            window.innerWidth * pixelRatio,
            window.innerHeight * pixelRatio
          ),
        },
      },
    };

    const material = new THREE.ShaderMaterial(params);
    materialRef.current = material;
    materialLoaderRef.current = material;

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
        materialRef.current.uniforms.uTime.value += deltaTime * 0.00015; // Mettre à jour uTime avec le temps écoulé en secondes
        rendererRef.current.render(sceneRef.current, cameraRef.current); // Rendu de la scène
        requestAnimationId = requestAnimationFrame(update); // Appel récursif de la fonction update
      }
      window.addEventListener("resize", handleResize);
      window.addEventListener("fullscreenchange", handleResize);
      window.addEventListener("webkitfullscreenchange", handleResize); // Safari and older versions of Chrome
      window.addEventListener("mozfullscreenchange", handleResize); // Firefox
      window.addEventListener("MSFullscreenChange", handleResize);
      update();
    }
    return () => {
      cancelAnimationFrame(requestAnimationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("fullscreenchange", handleResize);
      window.removeEventListener("webkitfullscreenchange", handleResize); // Safari and older versions of Chrome
      window.removeEventListener("mozfullscreenchange", handleResize); // Firefox
      window.removeEventListener("MSFullscreenChange", handleResize);
    };
  }, []);

  useEffect(() => {
    if (materialRef.current && materialRef.current.uniforms.uProgress) {
      console.log(materialRef.current.uniforms.uProgress, shaderPosition);
      gsap.to(materialRef.current.uniforms.uProgress, {
        value: shaderPosition,
        duration: 4,
        ease: "power1.inOut",
        // ease: "power1.out",
      });
    }
  }, [shaderPosition]);

  useEffect(() => {
    if (materialRef.current && materialRef.current.uniforms.uDistanceCircle) {
      console.log(distanceCircle);
      gsap.to(materialRef.current.uniforms.uDistanceCircle.value, {
        x: distanceCircle[0],
        y: distanceCircle[1],
        duration: 4,
        ease: "power1.inOut",
      });
    }
  }, [distanceCircle]);

  useEffect(() => {
    if (materialRef.current && materialRef.current.uniforms.uOffset) {
      gsap.to(materialRef.current.uniforms.uOffset, {
        value: offset,
        duration: 2,
        ease: "power2.inOut",
      });
    }
  }, [offset]);

  return (
    <canvas
      className={styles.canvas}
      ref={canvasRef}
      style={{ width: "100svw", height: "100svh", background: "transparent" }}
    ></canvas>
  );
};

export default LoaderShader;
