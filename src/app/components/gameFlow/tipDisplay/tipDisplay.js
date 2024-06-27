import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./tipDisplay.module.scss";

export default function TipDisplay() {
  const tipsRef = useRef(null);
  const tlRef = useRef(null);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const tips = gsap.utils.toArray(tipsRef.current.children);
    gsap.set(tips, { autoAlpha: 0 });

    const showTip = () => {
      gsap.set(tips[currentTip], { autoAlpha: 1 });
    };

    const hideTip = () => {
      gsap.set(tips[currentTip], { autoAlpha: 0 });
      setCurrentTip((prev) => (prev + 1) % tips.length);
    };

    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 8, onRepeat: hideTip });
    timeline.to(tips[currentTip], { autoAlpha: 1, duration: 2 });

    return () => {
      timeline.kill();
    };
  }, [currentTip]);

  return (
    <div ref={tipsRef} className={styles.tips}>
      <p>Discutez et comparez vos observations avec celles des autres joueurs pour rassembler des indices.</p>
      <p>Quand vous êtes Bluffer pensez aux questions que les autres joueurs pourraient poser et préparez vos réponses à l'avance.</p>
      <p>Si vous êtes plusieurs à suspecter un point particulier dans le récit du Bluffer, coordonnez vos questions.</p>
      <p>Intégrez des lieux ou des personnes réelles dans votre faux souvenir. Cela le rend plus plausible.</p>
      <p>Certaines détails peuvent ne pas faire sens chronologiquement ou logiquement. Analysez les récits avec un raisonnement logique.</p>
    </div>
  );
}