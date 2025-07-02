import React from "react";
import StartTrainingText from "../components/StartTraining/StartTrainingText";
import StartTrainingIntro from "../components/StartTraining/StartTrainingIntro";
import ScrollToTopButton from "../components/ScrollToTopButton";

const StartTraining = () => {
  return (
    <div>
      <StartTrainingText />
      <StartTrainingIntro />
      <ScrollToTopButton />
    </div>
  );
};

export default StartTraining;
