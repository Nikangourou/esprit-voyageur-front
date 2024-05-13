"use client";

import styles from "./images.module.scss";
import Countdown from "../../chrono/countdown";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

export default function Images() {
  const [isPaused, setIsPaused] = useState(true);

  const onEndCountdown = () => {
    console.log("End countdown");
  };

  return (
    <div className={styles.images}>
      <div className={styles.containerCountdown}>
        <Countdown start={120} onEnd={onEndCountdown} paused={isPaused} />
      </div>
      <h2>Prépare ton bluff</h2>
      <Swiper
        className={styles.swiper}
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <p>Voici ton véritable souvenir.</p>
          <img src="/image.png" alt="image1" />
          <p>Vérité</p>
        </SwiperSlide>
        <SwiperSlide>
          <p>La couleuvre que tu dois leur faire avaler...</p>
          <img src="/image2.webp" alt="image2" />
          <p>Mensonge</p>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
