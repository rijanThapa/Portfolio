import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaCog, FaAdjust } from "react-icons/fa";

const StereoControls = ({ onStereoToggle, onIntensityChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stereoEnabled, setStereoEnabled] = useState(true);
  const [intensity, setIntensity] = useState(1.0);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleStereoToggle = () => {
    const newState = !stereoEnabled;
    setStereoEnabled(newState);
    onStereoToggle?.(newState);
  };

  const handleIntensityChange = (newIntensity) => {
    setIntensity(newIntensity);
    onIntensityChange?.(newIntensity);
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Control Toggle Button */}
      <motion.button
        className="bg-black/20 backdrop-blur-sm border border-blue-400/30 rounded-full p-3 text-blue-400 hover:text-blue-300 hover:border-blue-300/50 transition-all duration-300 group"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <FaEye className="text-xl" />

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              className="absolute -bottom-12 right-0 bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-lg border border-blue-400/30 whitespace-nowrap"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Stereo Controls
              <div className="absolute top-0 right-4 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-black/80 border-l border-t border-blue-400/30"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-16 right-0 bg-black/30 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 min-w-[280px] shadow-2xl"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg flex items-center">
                <FaCog className="mr-2 text-blue-400" />
                Stereo Effect
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Stereo Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm font-medium">
                  Enable Stereo 3D
                </label>
                <motion.button
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    stereoEnabled ? "bg-blue-500" : "bg-gray-600"
                  }`}
                  onClick={handleStereoToggle}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                    animate={{
                      left: stereoEnabled ? "26px" : "4px",
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
              <p className="text-gray-400 text-xs">
                {stereoEnabled
                  ? "Stereo 3D effect is active"
                  : "Standard view mode"}
              </p>
            </div>

            {/* Intensity Slider */}
            <AnimatePresence>
              {stereoEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-gray-300 text-sm font-medium flex items-center">
                      <FaAdjust className="mr-2 text-blue-400" />
                      Intensity
                    </label>
                    <span className="text-blue-400 text-sm font-mono">
                      {intensity.toFixed(1)}x
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="range"
                      min="0.1"
                      max="2.0"
                      step="0.1"
                      value={intensity}
                      onChange={(e) =>
                        handleIntensityChange(parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                          ((intensity - 0.1) / 1.9) * 100
                        }%, #4b5563 ${
                          ((intensity - 0.1) / 1.9) * 100
                        }%, #4b5563 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Subtle</span>
                      <span>Intense</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info */}
            <div className="border-t border-blue-400/20 pt-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {stereoEnabled
                      ? "Experience depth perception with side-by-side stereo rendering. Move your mouse to see the parallax effect."
                      : "Toggle stereo mode for an immersive 3D background experience."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #60a5fa;
          cursor: pointer;
          border: 2px solid #1e40af;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #60a5fa;
          cursor: pointer;
          border: 2px solid #1e40af;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
};

export default StereoControls;
