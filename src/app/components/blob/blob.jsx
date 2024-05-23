"use client";
// BlobComponent.jsx
import React, { useRef, useEffect } from "react";
import { gsap, Sine } from "gsap";
import { useSelector } from "react-redux";

export default function Blob({
  numPoints,
  width = 100,
  height = 100,
  minRadius,
  maxRadius,
  minDuration,
  maxDuration,
  dataColor = "none",
  colorActive = false,
  color = "none",
  events = {},
  seed = 0,
  mask,
}) {
  const blobPathRef = useRef();
  const tlRef = useRef();
  const yoyoAnim = useRef();
  const yoyoAnim2 = useRef();
  const randSeed = useRef();
  const playersInGame = useSelector((state) => state.players.playersInGame);

  function mulberry32(seedVal) {
    return function () {
      seedVal |= 0;
      seedVal = (seedVal + 0x6d2b79f5) | 0;
      let t = Math.imul(seedVal ^ (seedVal >>> 15), 1 | seedVal);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  useEffect(() => {
    randSeed.current = mulberry32(seed);
    const blob = createBlob({
      element: blobPathRef.current,
      numPoints,
      width,
      height,
      minRadius,
      maxRadius,
      minDuration,
      maxDuration,
    });

    tlRef.current = blob.tl;
    tlRef.current.play();
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [
    numPoints,
    width,
    height,
    minRadius,
    maxRadius,
    minDuration,
    maxDuration,
  ]);

  useEffect(() => {
    if (playersInGame.includes(dataColor) && yoyoAnim.current) {
      yoyoAnim.current.play();
      yoyoAnim2.current.pause();
    }
  }, [playersInGame]);

  function createBlob(options) {
    const points = []; // This array will hold the center points for the blob

    const tl = gsap.timeline({
      onUpdate: function () {
        // Update the path 'd' attribute with the new animation locations each time the GSAP timeline updates
        if (options.element) {
          const pathDescription = cardinal(points, true, 1);
          options.element.setAttribute("d", pathDescription);
        }
      },
      paused: true,
    });

    yoyoAnim.current = gsap.timeline();
    yoyoAnim2.current = gsap.timeline();

    // Use the slice of a circle to calculate initial and target positions for the blob points
    const slice = (Math.PI * 2) / options.numPoints;
    for (let i = 0; i < options.numPoints; i++) {
      const angle = slice * i;
      const initialX = options.width / 2 + Math.cos(angle) * options.minRadius;
      const initialY = options.height / 2 + Math.sin(angle) * options.minRadius;
      const point = { x: initialX, y: initialY };
      points.push(point);

      const targetX = options.width / 2 + Math.cos(angle) * options.maxRadius;
      const targetY = options.height / 2 + Math.sin(angle) * options.maxRadius;

      const targetX2 =
        options.width / 2 + Math.cos(angle) * (options.maxRadius - 2.5);
      const targetY2 =
        options.height / 2 + Math.sin(angle) * (options.maxRadius - 2.5);

      // Create a GSAP tween for the point using `to` method chaining it with `yoyo` and `repeat` to make it bounce between minRadius and maxRadius
      yoyoAnim.current.to(
        point,
        {
          x: targetX,
          y: targetY,
          duration: random(options.minDuration, options.maxDuration),
          yoyo: true,
          repeat: -1,
          ease: Sine.easeInOut,
        },
        "<",
      );

      yoyoAnim2.current.to(
        point,
        {
          x: targetX2,
          y: targetY2,
          duration: random(options.minDuration, options.maxDuration) * 2,
          yoyo: true,
          repeat: -1,
          ease: Sine.easeInOut,
        },
        "<",
      );
    }
    if (seed) {
      yoyoAnim.current.pause();
      yoyoAnim2.current.play();
    } else {
      yoyoAnim.current.play();
      yoyoAnim2.current.pause();
    }

    tl.to({}, { duration: 1, repeat: -1 }); // Dummy tween to keep the timeline active
    tl.play(); // Start the animation

    return { tl: tl, points: points };
  }

  // Cardinal spline - a uniform Catmull-Rom spline with a tension option
  function cardinal(data, closed, tension) {
    if (!data || data.length < 1) return "M0 0";

    if (data.length < 1) return "M0 0";
    if (tension == null) tension = 1;

    let size = data.length - (closed ? 0 : 1);
    let path = "M" + data[0].x + " " + data[0].y + " C";

    for (let i = 0; i < size; i++) {
      let p0, p1, p2, p3;

      if (closed) {
        p0 = data[(i - 1 + size) % size];
        p1 = data[i];
        p2 = data[(i + 1) % size];
        p3 = data[(i + 2) % size];
      } else {
        p0 = i == 0 ? data[0] : data[i - 1];
        p1 = data[i];
        p2 = data[i + 1];
        p3 = i == size - 1 ? p2 : data[i + 2];
      }

      let x1 = p1.x + ((p2.x - p0.x) / 6) * tension;
      let y1 = p1.y + ((p2.y - p0.y) / 6) * tension;

      let x2 = p2.x - ((p3.x - p1.x) / 6) * tension;
      let y2 = p2.y - ((p3.y - p1.y) / 6) * tension;

      path +=
        " " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + p2.x + " " + p2.y;
    }

    return closed ? path + "z" : path;
  }

  function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    if (min > max) {
      var tmp = min;
      min = max;
      max = tmp;
    }
    const rand = min + (max - min) * randSeed.current();
    return rand;
  }

  return (
    <path
      id="blob"
      ref={blobPathRef}
      fill={seed ? color : colorActive ? color : "black"}
      style={{
        transition: "fill 1s ease-out",
      }}
      data-color={dataColor != "none" ? dataColor : "none"}
      mask={mask && `url(${mask})`}
      {...events}
    />
  );
}
