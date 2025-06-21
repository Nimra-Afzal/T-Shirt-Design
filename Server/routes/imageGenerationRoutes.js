import express from 'express';
import { GoogleGenAI, Modality } from '@google/genai';
import * as fs from 'node:fs';
import * as path from 'node:path';
import dotenv from 'dotenv';
const router = express.Router();

dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

router.post('/generate-image', async (req, res) => {
  try {
    const { prompt, basePrompt } = req.body;
    console.log('Received image generation request with prompt:', prompt);

    if (!prompt) {
      console.log('Error: No prompt provided in request');
      return res.status(400).json({ error: 'Prompt is required in the request body.' });
    }

    if (!basePrompt) {
      console.log('Error: No base prompt provided in request');
      return res.status(400).json({ error: 'Base prompt is required in the request body.' });
    }

    // Combine base prompt with user customization
    const finalPrompt = `
${basePrompt}
USER CUSTOMIZATION: ${prompt}.
Additional notes: Maintain consistency with the base requirements while incorporating the user's request.
    `;
    console.log('Final prompt for generation:', finalPrompt);

    console.log('Sending request to Gemini API...');
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: finalPrompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    console.log('Received response from Gemini API');

    const parts = response.candidates[0].content.parts;
    let textOutput = '';
    let imageBase64 = '';

    console.log('Processing response parts...');
    for (const part of parts) {
      if (part.text) {
        textOutput += part.text;
        console.log('Text part received:', textOutput.substring(0, 100) + '...');
      } else if (part.inlineData) {
        imageBase64 = part.inlineData.data;
        console.log('Image data received, length:', imageBase64.length);
      }
    }

    if (!imageBase64) {
      console.log('No image was generated in the response');
      return res.status(200).json({ message: 'No image generated', text: textOutput });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `generated_${timestamp}.png`;
    const imagePath = path.join(uploadsDir, filename);

    // Save the image to disk
    console.log('Saving image to disk...');
    const buffer = Buffer.from(imageBase64, 'base64');
    fs.writeFileSync(imagePath, buffer);
    console.log('Image saved successfully to:', imagePath);

    // Create URL for the image
    const imageUrl = `/uploads/${filename}`;

    console.log('Sending response to client...');
    res.json({
      message: 'Image and text generated successfully',
      text: textOutput,
      imageUrl: imageUrl
    });
    console.log('Response sent successfully');

  } catch (error) {
    console.error('Error in image generation process:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to generate content.' });
  }
});

export default router;