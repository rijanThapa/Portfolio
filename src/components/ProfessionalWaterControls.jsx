import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProfessionalWaterControls = ({ onSettingsChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({
    // Water Physics
    dropIntensity: 50,
    fallSpeed: 2.5,
    windStrength: 1.0,
    surfaceTension: 0.8,
    terminalVelocity: 8.0,

    // Visual Effects
    particleDensity: 75,
    splashIntensity: 1.0,
    rippleStrength: 1.0,
    refractionIndex: 1.33,

    // Atmospheric
    rainStreaks: true,
    waterWaves: true,
    atmosphericTurbulence: true,
    cinematicCamera: true,

    // Quality Settings
    renderQuality: "high",
    particleCount: 200,
    shaderComplexity: "professional",
  });

  const [activePreset, setActivePreset] = useState("default");

  const presets = {
    gentle: {
      dropIntensity: 25,
      fallSpeed: 1.5,
      windStrength: 0.3,
      surfaceTension: 0.9,
      splashIntensity: 0.6,
      rippleStrength: 0.8,
      particleDensity: 40,
    },
    moderate: {
      dropIntensity: 50,
      fallSpeed: 2.5,
      windStrength: 1.0,
      surfaceTension: 0.8,
      splashIntensity: 1.0,
      rippleStrength: 1.0,
      particleDensity: 75,
    },
    intense: {
      dropIntensity: 80,
      fallSpeed: 4.0,
      windStrength: 2.0,
      surfaceTension: 0.6,
      splashIntensity: 1.8,
      rippleStrength: 1.5,
      particleDensity: 100,
    },
    storm: {
      dropIntensity: 100,
      fallSpeed: 5.0,
      windStrength: 3.0,
      surfaceTension: 0.4,
      splashIntensity: 2.5,
      rippleStrength: 2.0,
      particleDensity: 150,
    },
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const applyPreset = (presetName) => {
    const preset = presets[presetName];
    if (preset) {
      const newSettings = { ...settings, ...preset };
      setSettings(newSettings);
      setActivePreset(presetName);
      onSettingsChange?.(newSettings);
    }
  };

  const Slider = ({ label, value, min, max, step, onChange, unit = "" }) => (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex justify-between items-center mb-2">
        <label className="text-white text-sm font-medium">{label}</label>
        <span className="text-blue-300 text-sm font-mono">
          {typeof value === "number" ? value.toFixed(1) : value}
          {unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
              ((value - min) / (max - min)) * 100
            }%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`,
          }}
        />
      </div>
    </motion.div>
  );

  const Toggle = ({ label, checked, onChange, description }) => (
    <motion.div
      className="flex items-center justify-between py-3 px-4 bg-gray-800/30 rounded-lg mb-3"
      whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.4)" }}
    >
      <div>
        <div className="text-white text-sm font-medium">{label}</div>
        {description && (
          <div className="text-gray-400 text-xs mt-1">{description}</div>
        )}
      </div>
      <motion.div
        className={`w-12 h-6 rounded-full cursor-pointer flex items-center ${
          checked ? "bg-blue-500" : "bg-gray-600"
        }`}
        onClick={() => onChange(!checked)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-5 h-5 bg-white rounded-full shadow-md"
          animate={{ x: checked ? 26 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      className="fixed top-4 right-4 z-50"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full shadow-lg backdrop-blur-sm border border-blue-400/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L20 7L14.74 12.26L21 13.09L12 12L10.91 5.74L4 7L9.26 1.74L3 0.91L12 2Z" />
          </svg>
        </motion.div>
      </motion.button>

      {/* Control Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 right-0 w-80 bg-gray-900/90 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl p-6"
          >
            <div className="text-white text-lg font-bold mb-6 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
              Professional Water FX
            </div>

            {/* Preset Buttons */}
            <div className="mb-6">
              <div className="text-white text-sm font-medium mb-3">
                Weather Presets
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(presets).map((preset) => (
                  <motion.button
                    key={preset}
                    onClick={() => applyPreset(preset)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activePreset === preset
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {preset.charAt(0).toUpperCase() + preset.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Physics Controls */}
            <div className="mb-6">
              <div className="text-white text-sm font-medium mb-4 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Physics Parameters
              </div>

              <Slider
                label="Drop Intensity"
                value={settings.dropIntensity}
                min={10}
                max={100}
                step={5}
                onChange={(value) =>
                  handleSettingChange("dropIntensity", value)
                }
                unit="%"
              />

              <Slider
                label="Fall Speed"
                value={settings.fallSpeed}
                min={0.5}
                max={6.0}
                step={0.1}
                onChange={(value) => handleSettingChange("fallSpeed", value)}
                unit="x"
              />

              <Slider
                label="Wind Strength"
                value={settings.windStrength}
                min={0.0}
                max={4.0}
                step={0.1}
                onChange={(value) => handleSettingChange("windStrength", value)}
                unit="x"
              />

              <Slider
                label="Surface Tension"
                value={settings.surfaceTension}
                min={0.1}
                max={1.0}
                step={0.05}
                onChange={(value) =>
                  handleSettingChange("surfaceTension", value)
                }
              />
            </div>

            {/* Visual Effects */}
            <div className="mb-6">
              <div className="text-white text-sm font-medium mb-4 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
                </svg>
                Visual Effects
              </div>

              <Slider
                label="Particle Density"
                value={settings.particleDensity}
                min={25}
                max={150}
                step={5}
                onChange={(value) =>
                  handleSettingChange("particleDensity", value)
                }
                unit="%"
              />

              <Slider
                label="Splash Intensity"
                value={settings.splashIntensity}
                min={0.2}
                max={3.0}
                step={0.1}
                onChange={(value) =>
                  handleSettingChange("splashIntensity", value)
                }
                unit="x"
              />

              <Slider
                label="Ripple Strength"
                value={settings.rippleStrength}
                min={0.3}
                max={2.5}
                step={0.1}
                onChange={(value) =>
                  handleSettingChange("rippleStrength", value)
                }
                unit="x"
              />

              <Slider
                label="Refraction Index"
                value={settings.refractionIndex}
                min={1.0}
                max={1.8}
                step={0.01}
                onChange={(value) =>
                  handleSettingChange("refractionIndex", value)
                }
              />
            </div>

            {/* Atmospheric Features */}
            <div className="mb-6">
              <div className="text-white text-sm font-medium mb-4 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v11H4V4z"
                    clipRule="evenodd"
                  />
                </svg>
                Atmospheric Effects
              </div>

              <Toggle
                label="Rain Streaks"
                checked={settings.rainStreaks}
                onChange={(value) => handleSettingChange("rainStreaks", value)}
                description="Dynamic rain streak effects"
              />

              <Toggle
                label="Water Waves"
                checked={settings.waterWaves}
                onChange={(value) => handleSettingChange("waterWaves", value)}
                description="Ambient water wave simulation"
              />

              <Toggle
                label="Atmospheric Turbulence"
                checked={settings.atmosphericTurbulence}
                onChange={(value) =>
                  handleSettingChange("atmosphericTurbulence", value)
                }
                description="Advanced wind and air resistance"
              />

              <Toggle
                label="Cinematic Camera"
                checked={settings.cinematicCamera}
                onChange={(value) =>
                  handleSettingChange("cinematicCamera", value)
                }
                description="Professional camera movements"
              />
            </div>

            {/* Quality Settings */}
            <div className="mb-4">
              <div className="text-white text-sm font-medium mb-3">
                Render Quality
              </div>
              <select
                value={settings.renderQuality}
                onChange={(e) =>
                  handleSettingChange("renderQuality", e.target.value)
                }
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-600"
              >
                <option value="low">Low (Performance)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Quality)</option>
                <option value="ultra">Ultra (Max Quality)</option>
              </select>
            </div>

            {/* Performance Info */}
            <div className="text-xs text-gray-400 text-center pt-4 border-t border-gray-700">
              Professional Water Physics Engine v2.0
              <br />
              Optimized for real-time rendering
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
          border: 2px solid #1e3a8a;
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
          border: 2px solid #1e3a8a;
        }
      `}</style>
    </motion.div>
  );
};

export default ProfessionalWaterControls;
