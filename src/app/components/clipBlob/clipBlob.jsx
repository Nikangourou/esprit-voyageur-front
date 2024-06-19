"use client";

import Blob from "../blob/blob";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { gsap } from "gsap";

export default function ClipBlob({
  width = 100,
  height = 100,
  numPoints = 12,
  minRadius = 15,
  maxRadius = 40,
  minDuration = 1,
  maxDuration = 2,
  color = "red",
  active = false,
  offset = 2.5,
  seed = 0,
  x = 0.85,
  y = 0.95,
}) {
  const groupRef = useRef();
  const svgRef = useRef();
  const htmlId = useRef(uuidv4());

  useEffect(() => {
    const tl = gsap
      .timeline()
      .to(groupRef.current, {
        scaleX: x,
        duration: 4,
        ease: "power2.out",
        yoyo: true,
        repeat: -1,
      })
      .to(
        groupRef.current,
        {
          scaleY: y,
          duration: 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        },
        "<",
      )
      .to(
        svgRef.current,
        { rotateZ: "360deg", duration: 120, repeat: -1, yoyo: true },
        "<",
      );
  });

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
    >
      <defs>
        <mask id={htmlId.current}>
          <rect x="0" y="0" width={width} height={height} fill={"white"} />

          <g ref={groupRef} transformOrigin={"center"}>
            <Blob
              width={width}
              height={height}
              numPoints={numPoints}
              maxRadius={maxRadius}
              minRadius={minRadius}
              minDuration={minDuration}
              maxDuration={maxDuration}
              color={"black"}
              seed={seed}
              active={active}
              offset={offset}
            />
          </g>
        </mask>
      </defs>
      <Blob
        width={width}
        height={height}
        numPoints={numPoints}
        maxRadius={maxRadius}
        minRadius={minRadius}
        minDuration={minDuration}
        maxDuration={maxDuration}
        color={color}
        seed={seed}
        mask={`#${htmlId.current}`}
        active={active}
        offset={offset}
      />
    </svg>
  );
}
