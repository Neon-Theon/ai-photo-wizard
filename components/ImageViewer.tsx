
import React from 'react';

interface ImageViewerProps {
  title: string;
  imageSrc: string | null;
  placeholder: React.ReactNode;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ title, imageSrc, placeholder }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg flex-grow flex flex-col">
      <h3 className="text-lg font-semibold text-gray-300 mb-3">{title}</h3>
      <div className="aspect-square w-full bg-slate-900/50 rounded-lg overflow-hidden flex items-center justify-center">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="object-contain h-full w-full" />
        ) : (
          placeholder
        )}
      </div>
    </div>
  );
};
