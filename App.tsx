
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageViewer } from './components/ImageViewer';
import { PromptInput } from './components/PromptInput';
import { Loader } from './components/Loader';
import { editImageWithNanoBanana } from './services/geminiService';
import { PhotoIcon, SparklesIcon, ExclamationTriangleIcon } from './components/Icons';

export default function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setError(null);
    setEditedImage(null);
    setResponseText(null);
    setOriginalMimeType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setOriginalImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleEditRequest = useCallback(async () => {
    if (!originalImage || !prompt || !originalMimeType) {
      setError('Please upload an image and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);
    setResponseText(null);

    try {
      // remove data:image/jpeg;base64, prefix
      const base64Data = originalImage.split(',')[1];
      const result = await editImageWithNanoBanana(base64Data, originalMimeType, prompt);
      
      if (result.editedImage) {
        setEditedImage(`data:${originalMimeType};base64,${result.editedImage}`);
      } else {
        setError("The AI didn't return an image. Please try a different prompt.");
      }
      
      if (result.text) {
        setResponseText(result.text);
      }

    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt, originalMimeType]);

  const canEdit = !!originalImage && prompt.length > 0 && !isLoading;

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Controls and Original Image */}
          <div className="flex flex-col gap-6">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">1. Upload Your Photo</h2>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>
            
            <ImageViewer
              title="Original"
              imageSrc={originalImage}
              placeholder={
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <PhotoIcon className="w-24 h-24" />
                  <p className="mt-2 text-lg">Your photo will appear here</p>
                </div>
              }
            />
          </div>

          {/* Right Column: Prompt and Edited Image */}
          <div className="flex flex-col gap-6">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">2. Describe Your Edit</h2>
              <PromptInput value={prompt} onChange={setPrompt} />
              <button
                onClick={handleEditRequest}
                disabled={!canEdit}
                className={`mt-4 w-full flex items-center justify-center gap-2 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300
                  ${canEdit
                    ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/50'
                    : 'bg-slate-600 cursor-not-allowed'
                  }`}
              >
                <SparklesIcon className="w-5 h-5" />
                {isLoading ? 'Generating...' : 'Apply AI Edit'}
              </button>
            </div>
            
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-xl flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0"/>
                <p>{error}</p>
              </div>
            )}
            
            <ImageViewer
              title="Edited"
              imageSrc={editedImage}
              placeholder={
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <>
                      <SparklesIcon className="w-24 h-24" />
                      <p className="mt-2 text-lg">Your edited photo will appear here</p>
                    </>
                  )}
                </div>
              }
            />
             {responseText && !error && (
                <div className="bg-slate-800 p-4 rounded-xl shadow-lg">
                    <p className="text-slate-300 italic">{responseText}</p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
