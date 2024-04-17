"use client";

import styles from "./page.module.scss";
import QrCode from "../../components/qrCode/qrCode";
import PageContainer from "../../components/pageContainer/pageContainer";

import { useContext, useEffect, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { SocketContext } from "../../context/socketContext";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { selectBlufferPlayer } from "../../store/reducers/playersReducer";

function QrCodeWithGameId() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");

  return <QrCode gameId={gameId} />;
}

export default function Code() {
  const router = useRouter();
  const isReady = useRef(false);
  const { socket } = useContext(SocketContext);
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket && !isReady.current) {
      isReady.current = true;
      socket.emit("connexionPrimary", gameId);
      dispatch(selectBlufferPlayer());
    }
    const handleNextPage = () => {
      console.log("tewt");
      // Rediriger vers la page suivante avec le gameId en paramètre
      router.push(`/game?gameId=${gameId}`);
    };

    socket.on("startChrono", handleNextPage);
    console.log("on");
    return () => {
      console.log("socketClose");
      socket.off("startChrono", handleNextPage);
    };
  }, [socket, gameId]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <PageContainer pageCategory={"bluffer"}>
          <Suspense fallback={<div>Loading...</div>}>
            <QrCodeWithGameId />
          </Suspense>
        </PageContainer>
      </div>
    </main>
  );
}
