"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.scss";
import { gsap, Sine } from "gsap";

export default function Home() {
  const buttonRef = useRef(null);
  const svgRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const blobRef = useRef();
  const tlRef = useRef();
  const hoverItemRef = useRef();
  const blobPathRef = useRef();

  useEffect(() => {
    if (!svgRef.current) return;
    const wibble = svgRef.current.getElementById("wibble");
    if (!wibble) return;

    const pointz = 30; // Number of points
    const width = 100; // Width of the line
    const spacing = width / pointz; // Space between points

    const pointzArray = Array.from({ length: pointz }).map((_, i) => {
      let point = wibble.points.appendItem(svgRef.current.createSVGPoint());
      point.x = i * spacing;
      point.y = 25;
      return point;
    });

    buttonRef.current.addEventListener("mouseenter", () => {
      if (isAnimatingRef.current) {
        return;
      }

      isAnimatingRef.current = true;

      pointzArray.forEach((point, index) => {
        const mapper = gsap.utils.mapRange(0, pointz, 0, 0.4);

        gsap
          .to(point, {
            keyframes: [
              { y: "+=6", ease: Sine.easeInOut },
              { y: "-=12", ease: Sine.easeInOut },
              { y: "+=6", ease: Sine.easeInOut },
            ],
            yoyo: true,
            duration: 0.6,
            onComplete: () => {
              if (index === 0) {
                isAnimatingRef.current = false;
              }
            },
          })
          .progress(mapper(index));
      });
    });
  }, []);

  useEffect(() => {
    const blob = createBlob({
      element: blobPathRef.current,
      numPoints: 8,
      centerX: 500,
      centerY: 500,
      minRadius: 400,
      maxRadius: 425,
      minDuration: 1,
      maxDuration: 2,
    });

    tlRef.current = blob.tl;
    tlRef.current.play();


    // Function to handle mouse enter
    const enterAnimation = () => {
      gsap.to(tlRef.current, {
        duration: 2,
        timeScale: 1,
        onStart: () => tlRef.current.play(),
      });
    };

    // Function to handle mouse leave
    const leaveAnimation = () => {
      gsap.to(tlRef.current, {
        duration: 2,
        timeScale: 0,
        onComplete: () => tlRef.current.pause(),
      });
    };

    // Add event listeners
    const hoverElem = hoverItemRef.current;
    hoverElem.addEventListener("mouseenter", enterAnimation);
    hoverElem.addEventListener("mouseleave", leaveAnimation);

    // Cleanup the event listeners on component unmount
    return () => {
      hoverElem.removeEventListener("mouseenter", enterAnimation);
      hoverElem.removeEventListener("mouseleave", leaveAnimation);
    };
  }, []);

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

    // Use the slice of a circle to calculate initial and target positions for the blob points
    const slice = (Math.PI * 2) / options.numPoints;
    for (let i = 0; i < options.numPoints; i++) {
      const angle = slice * i;
      const initialX = options.centerX + Math.cos(angle) * options.minRadius;
      const initialY = options.centerY + Math.sin(angle) * options.minRadius;
      const point = { x: initialX, y: initialY };
      points.push(point);

      const targetX = options.centerX + Math.cos(angle) * options.maxRadius;
      const targetY = options.centerY + Math.sin(angle) * options.maxRadius;

      // Create a GSAP tween for the point using `to` method chaining it with `yoyo` and `repeat` to make it bounce between minRadius and maxRadius
      gsap.to(point, {
        x: targetX,
        y: targetY,
        duration: random(options.minDuration, options.maxDuration),
        yoyo: true,
        repeat: -1,
        ease: Sine.easeInOut,
      });
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
    return min + (max - min) * Math.random();
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <img src="/Logo.svg" alt="Logo" />
        <div>
          <button ref={buttonRef} href="/intro">
            <a href="/intro">Jouer</a>
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" ref={svgRef}>
              <polyline
                stroke="#1C1C1E"
                id="wibble"
                fill="none"
                strokeWidth="45"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className={styles.btn2}>
          <svg ref={blobRef} id="svg" viewBox="0 0 1000 1000">
            <path id="blob" ref={blobPathRef} />
          </svg>
          <p ref={hoverItemRef}>Jouer</p>
        </div>
      </div>
    </main>
  );
}
