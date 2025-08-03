import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGem, FaCog, FaAdjust, FaPalette, FaSun } from "react-icons/fa";

const MetallicSpheresControls = ({
  onMetallicChange,
  onLightingChange,
  onDensityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [metallic, setMetallic] = useState(0.9);
  const [roughness, setRoughness] = useState(0.1);
  const [lightIntensity, setLightIntensity] = useState(1.2);
  const [sphereDensity, setSphereDensity] = useState(150);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Auto-hide after 8 seconds
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleMetallicChange = (newMetallic) => {
    setMetallic(newMetallic);
    onMetallicChange?.({ metallic: newMetallic, roughness });
  };

  const handleRoughnessChange = (newRoughness) => {
    setRoughness(newRoughness);
    onMetallicChange?.({ metallic, roughness: newRoughness });
  };

  const handleLightingChange = (newIntensity) => {
    setLightIntensity(newIntensity);
    onLightingChange?.(newIntensity);
  };

  const handleDensityChange = (newDensity) => {
    setSphereDensity(newDensity);
    onDensityChange?.(newDensity);
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Control Toggle Button */}
      <motion.button
        className="bg-black/20 backdrop-blur-sm border border-blue-400/30 rounded-full p-3 text-blue-400 hover:text-blue-300 hover:border-blue-300/50 transition-all duration-300 group relative"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <FaGem className="text-xl" />

        {/* Pulsing effect for metallic theme */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              className="absolute -bottom-12 right-0 bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-lg border border-blue-400/30 whitespace-nowrap"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Metallic Spheres Settings
              <div className="absolute top-0 right-4 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-black/80 border-l border-t border-blue-400/30"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-16 right-0 bg-black/30 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 min-w-[320px] shadow-2xl"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg flex items-center">
                <FaCog className="mr-2 text-blue-400" />
                Metallic Spheres
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Metallic Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm font-medium flex items-center">
                  <FaGem className="mr-2 text-blue-400" />
                  Metallic
                </label>
                <span className="text-blue-400 text-sm font-mono">
                  {metallic.toFixed(2)}
                </span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={metallic}
                  onChange={(e) =>
                    handleMetallicChange(parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                      metallic * 100
                    }%, #4b5563 ${metallic * 100}%, #4b5563 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Matte</span>
                  <span>Mirror</span>
                </div>
              </div>
            </div>

            {/* Roughness Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm font-medium flex items-center">
                  <FaAdjust className="mr-2 text-purple-400" />
                  Roughness
                </label>
                <span className="text-purple-400 text-sm font-mono">
                  {roughness.toFixed(2)}
                </span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={roughness}
                  onChange={(e) =>
                    handleRoughnessChange(parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                      roughness * 100
                    }%, #4b5563 ${roughness * 100}%, #4b5563 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Smooth</span>
                  <span>Rough</span>
                </div>
              </div>
            </div>

            {/* Light Intensity Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm font-medium flex items-center">
                  <FaSun className="mr-2 text-yellow-400" />
                  Lighting
                </label>
                <span className="text-yellow-400 text-sm font-mono">
                  {lightIntensity.toFixed(1)}x
                </span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0.3"
                  max="2.0"
                  step="0.1"
                  value={lightIntensity}
                  onChange={(e) =>
                    handleLightingChange(parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${
                      ((lightIntensity - 0.3) / 1.7) * 100
                    }%, #4b5563 ${
                      ((lightIntensity - 0.3) / 1.7) * 100
                    }%, #4b5563 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Dim</span>
                  <span>Bright</span>
                </div>
              </div>
            </div>

            {/* Sphere Density Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm font-medium flex items-center">
                  <FaPalette className="mr-2 text-green-400" />
                  Density
                </label>
                <span className="text-green-400 text-sm font-mono">
                  {sphereDensity}
                </span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={sphereDensity}
                  onChange={(e) =>
                    handleDensityChange(parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                      ((sphereDensity - 50) / 250) * 100
                    }%, #4b5563 ${
                      ((sphereDensity - 50) / 250) * 100
                    }%, #4b5563 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Sparse</span>
                  <span>Dense</span>
                </div>
              </div>
            </div>

            {/* Preset Buttons */}
            <div className="mb-4">
              <h4 className="text-gray-300 text-sm font-medium mb-3">
                Quick Presets
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 rounded-lg px-3 py-2 text-xs text-blue-300 transition-all duration-200"
                  onClick={() => {
                    handleMetallicChange(0.95);
                    handleRoughnessChange(0.05);
                    handleLightingChange(1.5);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Mirror Chrome
                </motion.button>
                <motion.button
                  className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 rounded-lg px-3 py-2 text-xs text-purple-300 transition-all duration-200"
                  onClick={() => {
                    handleMetallicChange(0.8);
                    handleRoughnessChange(0.2);
                    handleLightingChange(1.0);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Brushed Metal
                </motion.button>
                <motion.button
                  className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-400/30 rounded-lg px-3 py-2 text-xs text-yellow-300 transition-all duration-200"
                  onClick={() => {
                    handleMetallicChange(0.9);
                    handleRoughnessChange(0.1);
                    handleLightingChange(1.8);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Golden Shine
                </motion.button>
                <motion.button
                  className="bg-gray-600/20 hover:bg-gray-600/30 border border-gray-400/30 rounded-lg px-3 py-2 text-xs text-gray-300 transition-all duration-200"
                  onClick={() => {
                    handleMetallicChange(0.7);
                    handleRoughnessChange(0.3);
                    handleLightingChange(0.8);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Matte Steel
                </motion.button>
              </div>
            </div>

            {/* Info */}
            <div className="border-t border-blue-400/20 pt-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Adjust metallic properties to create different sphere
                    materials. Higher metallic values create mirror-like
                    surfaces, while lower roughness increases shine.
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
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          cursor: pointer;
          border: 2px solid #1e40af;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          cursor: pointer;
          border: 2px solid #1e40af;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
};

export default MetallicSpheresControls;
