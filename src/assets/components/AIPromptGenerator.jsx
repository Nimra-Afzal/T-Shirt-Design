import React, { useState } from 'react';
import * as THREE from 'three';

const AIPromptGenerator = ({ onGenerate, placeholder, label, type = 'pattern' }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedImages, setSavedImages] = useState([]);
  const [logoColor, setLogoColor] = useState('dark'); // 'dark' or 'light'

  // Function to process image and remove background
  const processImage = async (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Process each pixel
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate brightness and color difference
          const brightness = (r + g + b) / 3;
          const maxColor = Math.max(r, g, b);
          const minColor = Math.min(r, g, b);
          const colorDiff = maxColor - minColor;
          
          if (type === 'logo') {
            if (logoColor === 'dark') {
              // For dark logos
              if (brightness > 220 && colorDiff < 30) {
                // Make light, low-contrast pixels transparent
                data[i + 3] = 0;
              } else {
                // Enhance dark colors
                data[i] = Math.max(0, r - 20);
                data[i + 1] = Math.max(0, g - 20);
                data[i + 2] = Math.max(0, b - 20);
              }
            } else {
              // For light logos
              if (brightness < 30 && colorDiff < 30) {
                // Make dark, low-contrast pixels transparent
                data[i + 3] = 0;
              } else {
                // Enhance light colors
                data[i] = Math.min(255, r + 20);
                data[i + 1] = Math.min(255, g + 20);
                data[i + 2] = Math.min(255, b + 20);
              }
            }
          }
        }
        
        // Put the processed image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Convert to base64
        const processedImageUrl = canvas.toDataURL('image/png');
        resolve(processedImageUrl);
      };
      img.src = imageUrl;
    });
  };

  // Base prompts for different types
  const basePrompts = {
    logo: `Generate a professional, high-quality logo specifically designed for T-shirt printing. The logo should meet the following criteria:

1. Style: Clean, modern, and visually striking
2. Format: Single, centered design suitable for garment printing
3. Color: ${logoColor === 'dark' ? 'Use dark colors that will stand out on light t-shirts' : 'Use white or light colors that will stand out on dark t-shirts'}
4. Clarity: Maintain clean details and avoid clutter
5. Restrictions: Do not include text, human faces, or copyrighted material
6. Output Quality: 1024x1024 pixels, suitable for 3D wrapping and realistic preview
7. Design Elements: Focus on a single, impactful visual element
8. Simplicity: Keep the design simple and recognizable at different sizes
9. make logos a little dim light.
10. Use a ${logoColor === 'dark' ? 'pure white' : 'pure black'} background for better processing
11. Ensure high contrast between the logo and background
12. Avoid any semi-transparent or gradient effects

Make sure the final output is optimized for T-shirt printing and fashion display.`,
    pattern: `Generate a seamless, high-quality pattern or texture specifically designed for T-shirt printing. The design should meet the following criteria:

1. Style: Visually appealing and suitable for fashion—can include abstract, geometric, nature-inspired, or futuristic themes
2. Format: Seamless and tileable—no visible edges or breaks when repeated
3. Color: Use balanced and harmonious colors appropriate for fabric printing
4. Clarity: Maintain clean details and avoid clutter
5. Restrictions: Do not include text, human faces, brand logos, or copyrighted material
6. Output Quality: 4096x4096 pixels, suitable for 3D wrapping and realistic preview
7. Fabric Details: Optional but encouraged—subtle fabric textures for added realism
8. Lighting & Shading: Include soft, natural-looking shadows or highlights

Make sure the final output is optimized for realistic T-shirt mockups and fashion display.`
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          basePrompt: basePrompts[type]
        }),
      });

      const data = await response.json();
      
      if (data.imageUrl) {
        // Create full URL for the image
        const fullImageUrl = `http://localhost:5001${data.imageUrl}`;
        
        // Process the image if it's a logo
        let processedImageUrl = fullImageUrl;
        if (type === 'logo') {
          processedImageUrl = await processImage(fullImageUrl);
        }
        
        // Add new image to saved images
        setSavedImages(prev => [...prev, {
          id: Date.now(),
          url: processedImageUrl,
          prompt: prompt,
          logoColor: type === 'logo' ? logoColor : null
        }]);
        
        // Create texture and pass to parent
        const texture = new THREE.TextureLoader().load(processedImageUrl, (texture) => {
          // Configure texture based on type
          if (type === 'logo') {
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.repeat.set(1, 1);
            texture.transparent = true;
          } else {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
          }
          onGenerate(texture);
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <h4 className="text-md font-semibold mb-2">{label}</h4>
      {type === 'logo' && (
        <div className="mb-3">
          <label className="text-sm font-medium">Logo Color:</label>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setLogoColor('dark')}
              className={`flex-1 px-3 py-1 rounded text-sm font-medium ${
                logoColor === 'dark'
                  ? 'bg-[#00A8A8] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Dark Logo
            </button>
            <button
              onClick={() => setLogoColor('light')}
              className={`flex-1 px-3 py-1 rounded text-sm font-medium ${
                logoColor === 'light'
                  ? 'bg-[#00A8A8] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Light Logo
            </button>
          </div>
        </div>
      )}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className={`px-4 py-2 text-sm font-medium text-white rounded ${
            loading || !prompt.trim() 
              ? 'bg-[#00A8A8] opacity-50' 
              : 'bg-[#00A8A8] hover:bg-[#008B8B]'
          }`}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {/* Saved Images Gallery */}
      {savedImages.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold mb-2"></h5>
          <div className="grid grid-cols-3 gap-2">
            {savedImages.map(image => (
              <div 
                key={image.id}
                className="relative group cursor-pointer"
                onClick={async () => {
                  let imageUrl = image.url;
                  if (type === 'logo') {
                    imageUrl = await processImage(image.url);
                  }
                  const texture = new THREE.TextureLoader().load(imageUrl, (texture) => {
                    if (type === 'logo') {
                      texture.wrapS = THREE.ClampToEdgeWrapping;
                      texture.wrapT = THREE.ClampToEdgeWrapping;
                      texture.repeat.set(1, 1);
                      texture.transparent = true;
                    } else {
                      texture.wrapS = THREE.RepeatWrapping;
                      texture.wrapT = THREE.RepeatWrapping;
                      texture.repeat.set(2, 2);
                    }
                    onGenerate(texture);
                  });
                }}
              >
                <img 
                  src={image.url} 
                  alt={image.prompt}
                  className="w-full h-20 object-cover rounded"
                  style={type === 'logo' ? { 
                    mixBlendMode: image.logoColor === 'dark' ? 'multiply' : 'screen',
                    backgroundColor: image.logoColor === 'dark' ? 'white' : 'black',
                    filter: image.logoColor === 'dark' ? 'brightness(0.9)' : 'brightness(1.1)'
                  } : {}}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                  <span className="text-white text-xs p-1 text-center">
                    {image.prompt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPromptGenerator; 