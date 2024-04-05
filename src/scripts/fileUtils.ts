/**
 * получает данные о файлах
 * @param {FileList | null} files - список файлов для анализа
 * @return {Array<{ filename: string, size: number }>} - массив объектов с данными о файлах
 */
export function getFileData(files: FileList | null): { filename: string, size: number }[] {
  if (!files) {
    return [];
  }

  const fileData: { filename: string, size: number }[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    fileData.push({
      filename: file.name,
      size: file.size,
    });
  }

  return fileData;
}
