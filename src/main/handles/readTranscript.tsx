import path from 'path';
import { ensureDir, readFile } from 'fs-extra';

const readTranscript = async (args: any) => {
  const route = path.resolve(__dirname, 'store');

  await ensureDir(route);

  const transcriptLocation = `${route}/${args}`;

  const transcript = await readFile(transcriptLocation, {
    encoding: 'utf8',
  });

  return transcript;
};

export default readTranscript;
