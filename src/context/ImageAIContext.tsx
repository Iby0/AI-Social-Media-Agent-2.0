import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ImageInputModel, ImageOutputModel, ImageStyle, AspectRatio } from '../types/image-ai';
import { useImageAI } from '../hooks/useImageAI';
import { useImageHistory } from '../hooks/useImageHistory';

interface ImageAIContextType {
  input: ImageInputModel;
  setInput: React.Dispatch<React.SetStateAction<ImageInputModel>>;
  generateImage: (input?: ImageInputModel, useCache?: boolean) => Promise<ImageOutputModel | undefined>;
  isGenerating: boolean;
  generationStep: string;
  error: string | null;
  latestOutput: ImageOutputModel | null;
  setLatestOutput: (output: ImageOutputModel | null) => void;
  clearError: () => void;
  history: ImageOutputModel[];
  loadHistory: () => Promise<void>;
  deleteHistoryItem: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  selectedHistoryItem: ImageOutputModel | null;
  setSelectedHistoryItem: (item: ImageOutputModel | null) => void;
}

const defaultInput: ImageInputModel = {
  platform: 'linkedin',
  imageType: 'LinkedIn Banner',
  topic: 'AI Automation in Modern Software Development',
  caption: 'Transform your daily engineering workflow using generative AI content models.',
  keywords: ['Cloud Architecture', 'AI Engineering', 'Fullstack'],
  style: 'Technology',
  aspectRatio: '16:9',
  language: 'EN',
  brandColors: ['#3b82f6', '#1e293b', '#06b6d4'],
  logoPosition: 'top-right',
  backgroundPreference: 'Dark navy canvas with cyan glowing tech lines',
};

const ImageAIContext = createContext<ImageAIContextType | undefined>(undefined);

export const ImageAIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [input, setInput] = useState<ImageInputModel>(defaultInput);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<ImageOutputModel | null>(null);

  const {
    generateImage: execGenerate,
    isGenerating,
    generationStep,
    error,
    latestOutput,
    setLatestOutput,
    clearError,
  } = useImageAI();

  const {
    history,
    loadHistory,
    deleteItem: deleteHistoryItem,
    clearHistory,
  } = useImageHistory();

  const handleGenerate = async (overrideInput?: ImageInputModel, useCache: boolean = true) => {
    const targetInput = overrideInput || input;
    const output = await execGenerate(targetInput, useCache);
    if (output) {
      await loadHistory();
    }
    return output;
  };

  return (
    <ImageAIContext.Provider
      value={{
        input,
        setInput,
        generateImage: handleGenerate,
        isGenerating,
        generationStep,
        error,
        latestOutput,
        setLatestOutput,
        clearError,
        history,
        loadHistory,
        deleteHistoryItem,
        clearHistory,
        selectedHistoryItem,
        setSelectedHistoryItem,
      }}
    >
      {children}
    </ImageAIContext.Provider>
  );
};

export const useImageAIContext = () => {
  const context = useContext(ImageAIContext);
  if (!context) {
    throw new Error('useImageAIContext must be used within an ImageAIProvider');
  }
  return context;
};
