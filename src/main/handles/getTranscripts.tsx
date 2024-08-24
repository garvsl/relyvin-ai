import path from 'path';
import { ensureDir, readdir, writeFile } from 'fs-extra';
import { isEmpty } from 'lodash';

const getTranscripts = async () => {
  const route = path.resolve(__dirname, 'store');
  // /${arg}.txt
  await ensureDir(route);

  const fileNames = await readdir(route, {
    encoding: 'utf8',
    withFileTypes: false,
  });

  const files = fileNames.filter((file) => file.endsWith('.txt'));

  if (isEmpty(files)) {
    console.info('No notes found, creating a welcome note');

    await writeFile(`${route}/${'test'}.txt`, 'hello', {
      encoding: 'utf8',
    });

    files.push('test.txt');
  }
  // console.log(files);
  return files;
};

export default getTranscripts;
