
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
      setFileName(file.name);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
        setFileName(file.name);
    }
  }, [onImageUpload]);

  return (
    <div>
      <label
        htmlFor="file-upload"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative block w-full rounded-lg border-2 border-dashed border-slate-600 p-8 text-center hover:border-cyan-500 transition-colors duration-300 cursor-pointer"
      >
        <div className="flex flex-col items-center">
            <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
            <span className="mt-2 block text-sm font-medium text-slate-300">
                {fileName ? fileName : 'Drag and drop or click to upload'}
            </span>
        </div>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
