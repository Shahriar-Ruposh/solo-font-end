import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ToasterProps {
  message: string;
}

const Toaster: React.FC<ToasterProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toaster;
