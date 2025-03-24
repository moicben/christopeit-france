import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// BunnyCDN configuration
const BUNNY_CDN_STORAGE_ZONE = 'christopeitfrance';
const BUNNY_CDN_API_KEY = 'e6068993-9c52-4d8c-83d3d13bf304-5904-44c4';
const BUNNY_CDN_BASE_URL = `https://storage.bunnycdn.com/${BUNNY_CDN_STORAGE_ZONE}`;

// Image URL à télécharger et uploader
const IMAGE_URL = 'https://www.christopeit-sport.com/media/cc/28/c4/1729684277/Garda_2461_cover.png';
const REMOTE_PATH = 'Garda_2461_cover.png'; // Chemin distant sur BunnyCDN
const TEMP_IMAGE_PATH = './temp-images/Garda_2461_cover.png'; // Chemin local temporaire

// Fonction pour télécharger une image
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

// Fonction pour uploader une image sur BunnyCDN
async function uploadToBunnyCDN(filePath, remotePath) {
  const fileStream = fs.createReadStream(filePath);
  try {
    const response = await axios.put(`${BUNNY_CDN_BASE_URL}/${remotePath}`, fileStream, {
      headers: {
        AccessKey: BUNNY_CDN_API_KEY,
      },
    });
    console.log(`Upload successful: ${response.status}`);
  } catch (error) {
    console.error(`Error uploading to BunnyCDN:`, error.response?.status, error.response?.data || error.message);
  }
}

// Main function
async function testBunnyCDN() {
  try {
    console.log(`Downloading image from: ${IMAGE_URL}`);
    await downloadImage(IMAGE_URL, TEMP_IMAGE_PATH);
    console.log(`Image downloaded to: ${TEMP_IMAGE_PATH}`);

    console.log(`Uploading image to BunnyCDN at: ${REMOTE_PATH}`);
    await uploadToBunnyCDN(TEMP_IMAGE_PATH, REMOTE_PATH);

    // Cleanup temp file
    fs.unlinkSync(TEMP_IMAGE_PATH);
    console.log('Temporary file deleted.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testBunnyCDN();