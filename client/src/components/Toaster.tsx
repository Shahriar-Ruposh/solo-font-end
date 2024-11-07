import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ToasterProps {
  message: string;
  color: string;
}

const Toaster: React.FC<ToasterProps> = ({ message = "", color = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div initial={{ opacity: 9999, y: 50 }} animate={{ opacity: 99999, y: 0 }} exit={{ opacity: 99999, y: 50 }} className={`fixed top-5 right-4 bg-${color}-800 text-white px-4 py-2 rounded-md shadow-lg z-80`}>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toaster;
