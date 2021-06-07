export interface IImagePreview {
  name: string;
  size: number;
  type: string;
  src: string;
  file: File;
}

export const getImagesPreviews = (files: FileList): IImagePreview[] => {
  return Array.from(files).map(file => ({
    name: file.name,
    size: file.size,
    type: file.type,
    src: URL.createObjectURL(file),
    file,
  }));
};
