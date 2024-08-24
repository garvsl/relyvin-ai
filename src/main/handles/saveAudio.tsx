import path from 'path';
import fs from 'fs';

const saveAudio = async (buffer: any) => {
  try {
    const route = path.resolve(__dirname, 'store', 'audio');
    fs.mkdirSync(route, { recursive: true });
    const fileName = `audio_${Date.now()}.webm`;
    const filePath = path.join(route, fileName);

    const newBuffer = Buffer.from(buffer);
    fs.writeFileSync(filePath, newBuffer);
    return { success: true, path: filePath };
  } catch (error: any) {
    console.error('Error saving audio:', error);
    return { success: false, error: error.message };
  }
};

export default saveAudio;
