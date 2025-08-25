import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";

const LottieLoader = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Player
        autoplay
        loop
        src="../../Meditation.json"
        style={{ height: 450, width: 450 }}
      />
    </div>
  );
};

export default LottieLoader;
