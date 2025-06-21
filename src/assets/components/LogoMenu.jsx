import React from 'react';
import * as THREE from 'three';
import AIPromptGenerator from './AIPromptGenerator';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const LogoMenu = ({
  logoPosition,
  setLogoPosition,
  logoRotation,
  setLogoRotation,
  logoScale,
  setLogoScale,
  handleLogoUpload,
  selectedLogo,
  setSelectedLogo,
  isMenuVisible,
  setIsMenuVisible,
  
}) => {
  const handleAIGenerate = (texture) => {
    // The texture is already configured by AIPromptGenerator
    setSelectedLogo(texture);
  };
  return (
    <>
      {/* Toggle Button (Outside when menu is closed) */}
      {!isMenuVisible && (
        <button
          onClick={() => setIsMenuVisible(true)}
          className="absolute top-16 right-5 z-20 rounded-l-lg bg-[#00A8A8] text-white p-4 hover:bg-[#009494] transition-all duration-300"
        >
          <FaChevronLeft />
        </button>
      )}

      {/* Menu Container */}
      <div
        className={`absolute top-16 right-5 z-10 p-5 bg-gray-100/60 rounded-lg w-96 shadow-lg transition-all duration-300 ${
          isMenuVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Logo Settings</h3>
          {isMenuVisible && (
            <button
              onClick={() => setIsMenuVisible(false)}
              className="bg-[#00A8A8] text-white p-2 rounded-lg hover:bg-[#009494] transition-all duration-300"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
        
        {/* AI Logo Generator */}
        <AIPromptGenerator
          onGenerate={handleAIGenerate}
          placeholder="Describe the logo you want..."
          label="Generate Logo with AI"
          type="logo"
        />

        {/* Logo Upload */}
        <div className="mb-4">
          <h4 className="text-md font-semibold mb-2">Upload Logo</h4>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full text-sm mb-4"
          />
        </div>

        {selectedLogo && (
          <>
            {/* Position Controls */}
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-2">Position</h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  X:
                  <input
                    type="range"
                    min="-0.5"
                    max="0.5"
                    step="0.01"
                    value={logoPosition.x}
                    onChange={(e) => setLogoPosition(prev => ({ ...prev, x: parseFloat(e.target.value) }))}
                    className="slider w-full mx-3"
                  />
                  <span>{logoPosition.x.toFixed(2)}</span>
                </label>
                <label className="flex items-center justify-between">
                  Y:
                  <input
                    type="range"
                    min="-0.5"
                    max="0.5"
                    step="0.01"
                    value={logoPosition.y}
                    onChange={(e) => setLogoPosition(prev => ({ ...prev, y: parseFloat(e.target.value) }))}
                    className="slider w-full mx-3"
                  />
                  <span>{logoPosition.y.toFixed(2)}</span>
                </label>
              </div>
            </div>

            {/* Rotation Controls */}
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-2">Rotation</h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  X:
                  <input
                    type="range"
                    min="0"
                    max="6.28"
                    step="0.01"
                    value={logoRotation.x}
                    onChange={(e) => setLogoRotation(prev => ({ ...prev, x: parseFloat(e.target.value) }))}
                    className="slider w-full mx-3"
                  />
                  <span>{(logoRotation.x * 57.3).toFixed(0)}°</span>
                </label>
                <label className="flex items-center justify-between">
                  Y:
                  <input
                    type="range"
                    min="0"
                    max="6.28"
                    step="0.01"
                    value={logoRotation.y}
                    onChange={(e) => setLogoRotation(prev => ({ ...prev, y: parseFloat(e.target.value) }))}
                    className="slider w-full mx-3"
                  />
                  <span>{(logoRotation.y * 57.3).toFixed(0)}°</span>
                </label>
                <label className="flex items-center justify-between">
                  Z:
                  <input
                    type="range"
                    min="0"
                    max="6.28"
                    step="0.01"
                    value={logoRotation.z}
                    onChange={(e) => setLogoRotation(prev => ({ ...prev, z: parseFloat(e.target.value) }))}
                    className="slider w-full mx-3"
                  />
                  <span>{(logoRotation.z * 57.3).toFixed(0)}°</span>
                </label>
              </div>
            </div>

            {/* Scale Control */}
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-2">Scale</h4>
              <label className="flex items-center justify-between">
                Size:
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.01"
                  value={logoScale}
                  onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                  className="slider w-full mx-3"
                />
                <span>{logoScale.toFixed(2)}</span>
              </label>
            </div>

            <div className="flex gap-2">
              {/* Reset Button */}
              <button
                onClick={() => {
                  setLogoPosition({ x: 0, y: 0.04, z: 0.15 });
                  setLogoRotation({ x: 0, y: 0, z: 0 });
                  setLogoScale(0.15);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-black bg-[#00A8A8] rounded hover:bg-[#009494]"
              >
                Reset Settings
              </button>

              {/* Remove Logo Button */}
              <button
                onClick={() => {
                  setSelectedLogo(null);
                  setLogoPosition({ x: 0, y: 0.04, z: 0.15 });
                  setLogoRotation({ x: 0, y: 0, z: 0 });
                  setLogoScale(0.15);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-black bg-[#00A8A8] rounded hover:bg-[#009494]"
              >
                Remove Logo
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LogoMenu; 