import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTint, FaCog, FaAdjust, FaWater, FaCloudRain } from "react-icons/fa";

const WaterDropControls = ({
  onDropIntensityChange,
  onRainToggle,
  onWaveToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropIntensity, setDropIntensity] = useState(30);
  const [rainEnabled, setRainEnabled] = useState(true);
  const [wavesEnabled, setWavesEnabled] = useState(true);
  const [dropSpeed, setDropSpeed] = useState(2.5);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Auto-hide after 6 seconds
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleDropIntensityChange = (newIntensity) => {
    setDropIntensity(newIntensity);
    onDropIntensityChange?.(newIntensity);
  };

  const handleRainToggle = () => {
    const newState = !rainEnabled;
    setRainEnabled(newState);
    onRainToggle?.(newState);
  };

  const handleWaveToggle = () => {
    const newState = !wavesEnabled;
    setWavesEnabled(newState);
    onWaveToggle?.(newState);
  };

  const handleDropSpeedChange = (newSpeed) => {
    setDropSpeed(newSpeed);
    // You can add a callback for this if needed
  };

  return (
    <div className="fixed top-6 left-6 z-50">
      {/* Control Toggle Button */}
      <motion.button
        className="bg-black/20 backdrop-blur-sm border border-cyan-400/30 rounded-full p-3 text-cyan-400 hover:text-cyan-300 hover:border-cyan-300/50 transition-all duration-300 group relative"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <FaTint className="text-xl" />

        {/* Water ripple effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-400/20 animate-ping opacity-0 group-hover:opacity-75"></div>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              className="absolute -bottom-12 left-0 bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-lg border border-cyan-400/30 whitespace-nowrap"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Water Effects
              <div className="absolute top-0 left-4 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-black/80 border-l border-t border-cyan-400/30"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-16 left-0 bg-black/30 backdrop-blur-lg border border-cyan-400/30 rounded-2xl p-6 min-w-[300px] shadow-2xl"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg flex items-center">
                <FaCog className="mr-2 text-cyan-400" />
                Water Effects
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Rain Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm font-medium flex items-center">
                  <FaCloudRain className="mr-2 text-cyan-400" />
                  Rain Streaks
                </label>
                <motion.button
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    rainEnabled ? "bg-cyan-500" : "bg-gray-600"
                  }`}
                  onClick={handleRainToggle}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                    animate={{
                      left: rainEnabled ? "26px" : "4px",
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
            </div>

            {/* Waves Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm font-medium flex items-center">
                  <FaWater className="mr-2 text-blue-400" />
                  Water Waves
                </label>
                <motion.button
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    wavesEnabled ? "bg-blue-500" : "bg-gray-600"
                  }`}
                  onClick={handleWaveToggle}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                    animate={{
                      left: wavesEnabled ? "26px" : "4px",
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
            </div>

            {/* Drop Intensity Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm font-medium flex items-center">
                  <FaTint className="mr-2 text-cyan-400" />
                  Drop Count
                </label>
                <span className="text-cyan-400 text-sm font-mono">
                  {dropIntensity}
                </span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={dropIntensity}
                  onChange={(e) =>
                    handleDropIntensityChange(parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${
                      ((dropIntensity - 10) / 70) * 100
                    }%, #4b5563 ${
                      ((dropIntensity - 10) / 70) * 100
                    }%, #4b5563 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Light</span>
                  <span>Heavy</span>
                </div>
              </div>
            </div>

            {/* Drop Speed Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm font-medium flex items-center">
                  <FaAdjust className="mr-2 text-purple-400" />
                  Fall Speed
                </label>
                <span className="text-purple-400 text-sm font-mono">
                  {dropSpeed.toFixed(1)}x
                </span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={dropSpeed}
                  onChange={(e) =>
                    handleDropSpeedChange(parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                      ((dropSpeed - 0.5) / 4.5) * 100
                    }%, #4b5563 ${
                      ((dropSpeed - 0.5) / 4.5) * 100
                    }%, #4b5563 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>

            {/* Preset Buttons */}
            <div className="mb-4">
              <h4 className="text-gray-300 text-sm font-medium mb-3">
                Weather Presets
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <motion.button
                  className="bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-400/30 rounded-lg px-3 py-2 text-xs text-cyan-300 transition-all duration-200"
                  onClick={() => {
                    handleDropIntensityChange(15);
                    handleDropSpeedChange(1.5);
                    setRainEnabled(false);
                    setWavesEnabled(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Light Drizzle 🌦️
                </motion.button>
                <motion.button
                  className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 rounded-lg px-3 py-2 text-xs text-blue-300 transition-all duration-200"
                  onClick={() => {
                    handleDropIntensityChange(40);
                    handleDropSpeedChange(3.0);
                    setRainEnabled(true);
                    setWavesEnabled(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Heavy Rain ⛈️
                </motion.button>
                <motion.button
                  className="bg-gray-600/20 hover:bg-gray-600/30 border border-gray-400/30 rounded-lg px-3 py-2 text-xs text-gray-300 transition-all duration-200"
                  onClick={() => {
                    handleDropIntensityChange(0);
                    setRainEnabled(false);
                    setWavesEnabled(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear Sky ☀️
                </motion.button>
              </div>
            </div>

            {/* Info */}
            <div className="border-t border-cyan-400/20 pt-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Control the water effects to create different atmospheric
                    moods. Rain streaks add depth while water waves create
                    surface interaction.
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
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 2px solid #0891b2;
          box-shadow: 0 2px 6px rgba(6, 182, 212, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 2px solid #0891b2;
          box-shadow: 0 2px 6px rgba(6, 182, 212, 0.4);
        }
      `}</style>
    </div>
  );
};

export default WaterDropControls;
