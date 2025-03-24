import fs from "fs";
import path from "path";
import axios from "axios";
import sharp from "sharp";
import dotenv from "dotenv";

dotenv.config();

// BunnyCDN configuration
const BUNNY_CDN_STORAGE_ZONE = 'christopeitfrance'; //christopeit-france
const BUNNY_CDN_API_KEY = '6c30f648-712d-4b3d-a6b6-3d881299f764cde34b02-68b8-44f4-bb0d-74ffb9ce0e26';
const BUNNY_CDN_BASE_URL = `https://storage.bunnycdn.com/${BUNNY_CDN_STORAGE_ZONE}`;

// Paths
const PRODUCTS_FILE = path.join('../products.json');
const TEMP_DIR = path.join('temp-images');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

// Function to add delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to download an image
async function downloadImage(url, outputPath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// Function to compress an image
async function compressImage(inputPath, outputPath) {
  await sharp(inputPath)
    .resize(800)
    .jpeg({ quality: 80 })
    .toFile(outputPath);
}

// Function to upload an image to BunnyCDN
async function uploadToBunnyCDN(filePath, remotePath) {
  const fileStream = fs.createReadStream(filePath);
  const response = await axios.put(`${BUNNY_CDN_BASE_URL}/${remotePath}`, fileStream, {
    headers: {
      AccessKey: BUNNY_CDN_API_KEY,
    },
  });
  return response.status === 201;
}

// Main function
async function processImages() {
  try {
    const productsData = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    const products = productsData.products;

    for (const product of products) {
      if (product.productImages && product.productImages.length > 0) {
        for (const imageUrl of product.productImages) {
          try {
            await delay(1000); // Add delay between requests
            const imageName = path.basename(imageUrl);
            const tempImagePath = path.join(TEMP_DIR, imageName);
            const compressedImagePath = path.join(TEMP_DIR, `compressed-${imageName}`);
            const remotePath = `compressed-images/${imageName}`;


            console.log(`My key is: ${BUNNY_CDN_API_KEY}`);
            console.log(`Processing image: ${imageUrl}`);

            // Step 1: Download the image
            await downloadImage(imageUrl, tempImagePath);

            // Step 2: Compress the image
            await compressImage(tempImagePath, compressedImagePath);

            // Step 3: Upload the compressed image to BunnyCDN
            const success = await uploadToBunnyCDN(compressedImagePath, remotePath);
            if (success) {
              console.log(`Uploaded to BunnyCDN: ${remotePath}`);
            } else {
              console.error(`Failed to upload: ${remotePath}`);
            }

            // Cleanup temp files
            fs.unlinkSync(tempImagePath);
            fs.unlinkSync(compressedImagePath);
          } catch (error) {
            console.error(`Error processing image ${imageUrl}:`, error.response?.status || error.message);
          }
        }
      }
    }

    console.log('Image processing completed.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

processImages();