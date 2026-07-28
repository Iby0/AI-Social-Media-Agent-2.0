/**
 * Media File Validation Module
 * Module 08 - Media Library & File Management System
 */

import { MediaRecord } from '../../database/types';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  isDuplicate?: boolean;
}

export const SUPPORTED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

// Architecture prepared for future formats
export const FUTURE_MIME_TYPES = [
  'image/gif',
  'video/mp4',
  'video/webm',
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB Default Limit per file

export function validateFileType(file: File): ValidationResult {
  const fileType = file.type.toLowerCase();
  
  if (SUPPORTED_MIME_TYPES.includes(fileType)) {
    return { isValid: true };
  }

  if (FUTURE_MIME_TYPES.includes(fileType)) {
    return {
      isValid: false,
      error: `Format '${file.type}' (GIF/Video) will be fully supported in the upcoming expansion pack. Please upload PNG, JPG, JPEG, or WEBP.`,
    };
  }

  return {
    isValid: false,
    error: `Unsupported file format '${file.type || 'unknown'}'. Please upload PNG, JPG, JPEG, or WEBP images.`,
  };
}

export function validateFileSize(file: File, maxSizeBytes: number = MAX_FILE_SIZE_BYTES): ValidationResult {
  if (file.size <= maxSizeBytes) {
    return { isValid: true };
  }

  const maxMB = (maxSizeBytes / (1024 * 1024)).toFixed(0);
  const fileMB = (file.size / (1024 * 1024)).toFixed(1);

  return {
    isValid: false,
    error: `File size (${fileMB} MB) exceeds maximum limit of ${maxMB} MB. Please compress or choose a smaller file.`,
  };
}

export function checkDuplicateFile(file: File, existingMediaList: MediaRecord[]): ValidationResult {
  const isDuplicate = existingMediaList.some(
    (item) => item.fileName.toLowerCase() === file.name.toLowerCase() && Math.abs(item.fileSize - file.size) < 100
  );

  if (isDuplicate) {
    return {
      isValid: true,
      isDuplicate: true,
      error: `Notice: A file named "${file.name}" with identical size already exists in your library.`,
    };
  }

  return { isValid: true, isDuplicate: false };
}

export function validateMediaFile(file: File, existingMediaList: MediaRecord[] = []): ValidationResult {
  // 1. Type check
  const typeResult = validateFileType(file);
  if (!typeResult.isValid) return typeResult;

  // 2. Size check
  const sizeResult = validateFileSize(file);
  if (!sizeResult.isValid) return sizeResult;

  // 3. Duplicate check
  const dupResult = checkDuplicateFile(file, existingMediaList);
  return dupResult;
}
