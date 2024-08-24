import path from 'path';
import { exec } from 'child_process';

const transcript = async (webmPath: any) => {
  console.log(`Starting transcription for: ${webmPath}`);
  try {
    const scriptPath = path.join(__dirname, 'package', 'run_transcribe.sh');
    console.log(`Running script: ${scriptPath}`);

    const result = await new Promise((resolve, reject) => {
      exec(`"${scriptPath}" "${webmPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Execution error: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.error(`Script stderr: ${stderr}`);
        }
        console.log(`Script stdout: ${stdout}`);
        resolve(stdout);
      });
    });

    console.log(`Transcription completed successfully`);
    return { success: true, result };
  } catch (error: any) {
    console.error(`Transcription failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export default transcript;
