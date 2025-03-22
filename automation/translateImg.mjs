import fetch from 'node-fetch';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Jimp, loadFont } from "jimp";
import { SANS_10_BLACK } from "jimp/fonts";

// Configurez votre clé API OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// URL de l'image
const imageUrl = 'https://www.christopeit-sport.com/media/d9/79/74/1733831885/PS02_Garda_2461.jpg';

// Clé API OCR
const ocrApiKey = 'K86740793388957';

// Fonction pour extraire le texte de l'image en utilisant l'API OCR de ocr.space
async function extractTextFromImage(url) {
    const formData = new URLSearchParams();
    formData.append("apikey", ocrApiKey);
    formData.append("url", url);
    formData.append("language", "ger"); // Allemand
    formData.append("filetype", "JPG"); // Format correct en majuscules

    const response = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
    });

    const data = await response.json();
    if (data.IsErroredOnProcessing) {
        throw new Error(data.ErrorMessage[0]);
    }

    if (!data.ParsedResults || data.ParsedResults.length === 0) {
        throw new Error('No parsed results found');
    }

    return data.ParsedResults[0].ParsedText;
}

// Fonction pour traduire le texte
async function translateText(text) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
                { role: 'system', content: 'Tu es un outil de traduction allemand vers français, je te donne du texte en allemand, et tu réponds UNIQUEMENT avec sa traduction en français, voici le texte à traduire :' },
                { role: 'user', content: `${text}` }
            ],
            max_tokens: 2000
        });

        let translatedText = response.choices[0].message.content.trim();
        translatedText = translatedText.replace(/Réponds uniquement avec le texte traduit rien d'autre./g, '').trim();
        translatedText = translatedText.replace(/Voici le texte traduit :/g, '').trim();

        return translatedText;
    } catch (error) {
        console.error('Error generating translation:', error);
        throw error;
    }
}

// Fonction pour télécharger et enregistrer l'image
async function downloadImage(url, filepath) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filepath, buffer);
    console.log('✅ Image enregistrée:', filepath);
}

// Fonction pour remplacer le texte sur l'image
async function replaceTextOnImage(imagePath, text) {
    const image = await Jimp.read(imagePath);
    const font = await loadFont(SANS_10_BLACK);

    // Vérifier si le texte est bien défini
    if (!text || typeof text !== "string") {
        throw new Error("❌ Le texte à imprimer est invalide.");
    }

    // Nettoyer le texte
    const sanitizedText = text.trim() || "Texte non disponible";

    console.log('🖋 Texte ajouté sur l\'image:', sanitizedText);

    // Ajouter le texte à l'image avec centrage horizontal
    image.print(font, 50, 50, { text: sanitizedText, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, 500);

    await image.writeAsync(imagePath);
    console.log('✅ Texte remplacé sur l\'image:', imagePath);
}

// Fonction principale
async function main() {
    try {
        console.log('🚀 Extraction du texte...');
        const text = await extractTextFromImage(imageUrl);
        console.log('✅ Texte extrait:', text);

        console.log('🌍 Traduction en cours...');
        const translatedText = await translateText(text);
        console.log('✅ Texte traduit:', translatedText);

        // Définition du chemin d'enregistrement de l'image
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const imagePath = path.join(__dirname, 'image.jpg');

        console.log('📥 Téléchargement de l\'image...');
        await downloadImage(imageUrl, imagePath);

        console.log('🖍 Ajout du texte sur l\'image...');
        await replaceTextOnImage(imagePath, translatedText);
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

main();
ZZ