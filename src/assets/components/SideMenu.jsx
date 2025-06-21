import React from 'react';
import AIPromptGenerator from './AIPromptGenerator';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import * as THREE from 'three';

const SideMenu = ({
  setSelectedPattern,
  setUseColor,
  pattern1,
  pattern2,
  pattern3,
  pattern4,
  pattern5,
  pattern6,
  repeatX,
  setRepeatX,
  repeatY,
  setRepeatY,
  offsetX,
  setOffsetX,
  offsetY,
  setOffsetY,
  resetValues,
  handleImageUpload,
  selectedColor,
  setSelectedColor,
  isMenuVisible,
  setIsMenuVisible
}) => {
  const handleAIGenerate = (texture) => {
    // The texture is already configured with wrapping and repeat
    setSelectedPattern(texture);
    setUseColor(false);
  };

  return (
    <>
      {/* Toggle Button (Outside when menu is closed) */}
      {!isMenuVisible && (
        <button
          onClick={() => setIsMenuVisible(true)}
          className="absolute top-5 left-5 z-20 rounded-r-lg bg-[#00A8A8] text-white p-4 hover:bg-[#009494] transition-all duration-300"
        >
          <FaChevronRight />
        </button>
      )}

      {/* Menu Container */}
      <div
        className={`absolute top-3 left-5 z-10 p-5 bg-gray-100/60 rounded-lg w-96 shadow-lg transition-all duration-300 ${
          isMenuVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Pattern Settings</h3>
          {isMenuVisible && (
            <button
              onClick={() => setIsMenuVisible(false)}
              className="bg-[#00A8A8] text-white p-2 rounded-lg hover:bg-[#009494] transition-all duration-300"
            >
              <FaChevronLeft />
            </button>
          )}
        </div>

        {/* AI Pattern Generator */}
        <AIPromptGenerator
          onGenerate={handleAIGenerate}
          placeholder="Describe the pattern you want..."
          label="Generate Pattern with AI"
          type="pattern"
        />

        <h3 className="text-lg font-semibold mb-3">Select Pattern</h3>
        <div className="flex gap-2 mb-4">
          <button
            className="relative w-12 h-12 rounded-lg overflow-hidden hover:ring-2 hover:ring-black transition-all"
            onClick={() => {
              setSelectedPattern(pattern1);
              setUseColor(false);
            }}
          >
            <img 
              src="./pattern-07.jpg" 
              alt="Pattern 1" 
              className="w-full h-full object-cover"
            />
          </button>
          <button
            className="relative w-12 h-12 rounded-lg overflow-hidden hover:ring-2 hover:ring-black transition-all"
            onClick={() => {
              setSelectedPattern(pattern2);
              setUseColor(false);
            }}
          >
            <img 
              src="./Pattern-02.jpg" 
              alt="Pattern 2" 
              className="w-full h-full object-cover"
            />
          </button>
          <button
            className="relative w-12 h-12 rounded-lg overflow-hidden hover:ring-2 hover:ring-black transition-all"
            onClick={() => {
              setSelectedPattern(pattern3);
              setUseColor(false);
            }}
          >
            <img 
              src="./Pattern-03.jpg" 
              alt="Pattern 3" 
              className="w-full h-full object-cover"
            />
          </button>
          <button
            className="relative w-12 h-12 rounded-lg overflow-hidden hover:ring-2 hover:ring-black transition-all"
            onClick={() => {
              setSelectedPattern(pattern4);
              setUseColor(false);
            }}
          >
            <img 
              src="./Pattern-04.jpg" 
              alt="Pattern 4" 
              className="w-full h-full object-cover"
            />
          </button>
          <button
            className="relative w-12 h-12 rounded-lg overflow-hidden hover:ring-2 hover:ring-black transition-all"
            onClick={() => {
              setSelectedPattern(pattern5);
              setUseColor(false);
            }}
          >
            <img 
              src="./Pattern-05.jpg" 
              alt="Pattern 5" 
              className="w-full h-full object-cover"
            />
          </button>
          <button
            className="relative w-12 h-12 rounded-lg overflow-hidden hover:ring-2 hover:ring-black transition-all"
            onClick={() => {
              setSelectedPattern(pattern6);
              setUseColor(false);
            }}
          >
            <img 
              src="./Pattern-06.jpg" 
              alt="Pattern 6" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
        <h3 className="text-lg font-semibold mb-3">Repeat</h3>
        <div className="mb-4">
          <label className="flex items-center justify-between">
            X:
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={repeatX}
              onChange={(e) => setRepeatX(Number(e.target.value))}
              className="slider w-full mx-3"
              style={{ background: `linear-gradient(to right, black ${(repeatX - 1) * 11}%, white ${(repeatX - 1) * 11}%)` }}
            />
            <span>{repeatX.toFixed(1)}</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center justify-between">
            Y:
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={repeatY}
              onChange={(e) => setRepeatY(Number(e.target.value))}
              className="slider w-full mx-3"
              style={{ background: `linear-gradient(to right, black ${(repeatY - 1) * 11}%, white ${(repeatY - 1) * 11}%)` }}
            />
            <span>{repeatY.toFixed(1)}</span>
          </label>
        </div>
        <h3 className="text-lg font-semibold mb-3">Offset</h3>
        <div className="mb-4">
          <label className="flex items-center justify-between">
            X:
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={offsetX}
              onChange={(e) => setOffsetX(Number(e.target.value))}
              className="slider w-full mx-3"
              style={{ background: `linear-gradient(to right, black ${(offsetX + 1) * 50}%, white ${(offsetX + 1) * 50}%)` }}
            />
            <span>{offsetX.toFixed(2)}</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center justify-between">
            Y:
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={offsetY}
              onChange={(e) => setOffsetY(Number(e.target.value))}
              className="slider w-full mx-3"
              style={{ background: `linear-gradient(to right, black ${(offsetY + 1) * 50}%, white ${(offsetY + 1) * 50}%)` }}
            />
            <span>{offsetY.toFixed(2)}</span>
          </label>
        </div>
        <button
          className="block w-full mb-4 px-4 py-2 text-sm font-medium text-white bg-[#00A8A8] rounded hover:bg-[#009494]"
          onClick={resetValues}
        >
          Reset
        </button>
        
        <h3 className="text-lg font-semibold mb-3">Upload Pattern</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full text-sm mb-4"
        />
        <h3 className="text-lg font-semibold mb-3">Select Color</h3>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => {
            setSelectedColor(e.target.value);
            setUseColor(true);
          }}
          className="w-full h-10 border rounded"
        />
      </div>
    </>
  );
};

export default SideMenu;