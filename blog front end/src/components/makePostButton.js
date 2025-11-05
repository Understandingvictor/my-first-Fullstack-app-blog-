import { buttonAnimation } from "../motions/motion1.motions";
import { motion } from "motion/react";

function ShareYours({ text, className }) {
  return (
    <motion.button
      whileTap="whileTap"
      className={className}>
      {text}
    </motion.button>
  );
}
export default ShareYours;