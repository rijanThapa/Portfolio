import { useEffect } from "react";
import LandaningPage from "./views/LandaingPage/LandaningPage";
import AOS from "aos";
import "aos/dist/aos.css";
export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 5000,
      easing: "ease-out-back",
      once: false,
    });
  }, []);

  return (
    <>
      <LandaningPage />
    </>
  );
}
