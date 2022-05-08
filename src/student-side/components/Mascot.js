import React from "react";
import { Image } from "antd";
import ChatbotRingEyesClosed from "../../images/ChatbotRing3-eyesclosed-removebg.png";
import ChatbotRingMouthOpen from "../../images/ChatbotRing3-mouthopen-removebg.jpg";
import ChatbotRingMouthOpenEyesClosed from "../../images/ChatbotRing3-mouthopeneyesclosed-removebg.png";
import ChatbotRingEyebrowsRaised from "../../images/ChatbotRing3-eyebrowsraised-removebg.png";
const Mascot = ({ type }) => {
  const getMascotType = (type) => {
    if (type === 0) {
      return ChatbotRingEyesClosed;
    } else if (type === 1) {
      return ChatbotRingMouthOpen;
    } else if (type === 2) {
      return ChatbotRingMouthOpenEyesClosed;
    } else {
      return ChatbotRingEyebrowsRaised;
    }
  };
  return <Image width={50} src={getMascotType(type)} preview={false} />;
};

export default Mascot;
