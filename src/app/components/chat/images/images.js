"use client";

import styles from "./images.module.scss";
import Countdown from "../../chrono/countdown";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ImageShader from "../../imageShader/ImageShader";
import { setLoadingImages } from "../../../store/reducers/gameReducer";
import { useDispatch } from "react-redux";
import "swiper/css";

export default function Images() {
  const [isPaused, setIsPaused] = useState(true);
  const [isBlurry, setIsBlurry] = useState(true);
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();
  const trueImageId = useSelector((state) => state.players.trueImageId);
  const falseImageId = useSelector((state) => state.players.falseImageId);

  if (typeof window === "undefined") {
    return <div></div>;
  }
  const width = window.innerWidth - window.innerWidth * 0.2;

  useEffect(() => {
    const arrayTmp = [trueImageId, falseImageId];
    arrayTmp.forEach((imageId) => {
      fetch(`${apiUrl}/image/get/${imageId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setImages((currentImages) => [
            ...currentImages,
            {
              id: uuidv4(),
              url: `${apiUrl}${data.url}`,
              isTrue: data.isTrue,
            },
          ]);
        });
    });
    if (images.length === 2) {
      dispatch(setLoadingImages(false));
    }
  }, [trueImageId, falseImageId]);

  const onEndCountdown = () => {
    console.log("End countdown");
  };

  setTimeout(() => {
    setIsBlurry(false);
  }, 200);

  return (
    <div className={styles.images}>
      <div className={styles.containerCountdown}>
        <Countdown start={120} onEnd={onEndCountdown} paused={isPaused} />
      </div>
      <h2>Prépare ton bluff</h2>
      <p>Voici ton véritable souvenir.</p>
      <p>La couleuvre que tu dois leur faire avaler...</p>
      <p>Vérité</p>
      <p>Mensonge</p>

      <Swiper
        className={styles.swiper}
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <div className={styles.imageContainer}>
              <ImageShader
                url={image.url}
                isBlurry={isBlurry}
                width={width}
                height={width}
              ></ImageShader>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
