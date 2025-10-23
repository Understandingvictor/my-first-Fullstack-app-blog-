import { animate } from 'motion';
import { easeOut, motion } from 'motion/react';

export const postCardAnimation = {
  hidden: { 
        scale: 0.5, 
        opacity: 0 ,
        filter: "blur(10px)", // start blurred
  },
  visible: { 
    scale: 0.9, 
    opacity: 1,
    filter: "blur(0px)", // clear it up
    transition: {
        duration: 0.9,
        filter: { duration: 0.6, ease: "easeOut" },
        scale: { type: "spring", bounce: 0.3 }
    }
  },
  whileHover: {
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};
export const buttonAnimation = {
    initial: { scale: 1 },
     animate: {
    scale: [1, 1.08, 1], // grow → shrink → back
    transition: {
      duration: 1.5, // full cycle
      ease: "easeInOut",
      repeat: Infinity, // loop forever
      repeatType: "loop",
    },
  },
    whileTap: {
        scale: 0.8,
        transition: {
            duration: 0.3,
            ease:"easeOut"
        }
    }
}

export const buttonAnimation2 = {
    initial: { scale: 1 },
    whileTap: {
        scale: 0.8,
        transition: {
            duration: 0.3,
            ease:"easeOut"
        }
    }
}
export const postCardstyle = {
    margin: "5px",
    border: "2px solid black",
    overflow:"hidden"
}