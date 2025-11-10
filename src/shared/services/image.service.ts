/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get the full URL for an image path
   * Converts relative paths to absolute URLs
   * @param imagePath - Relative or absolute image path
   * @returns Full URL or null if no path provided
   */
  getImageUrl(imagePath: string | null): string | null {
    if (!imagePath) return null;
    const baseUrl = this.configService.get<string>('BASE_URL');
    // If path already starts with http, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Ensure path doesn't start with slash for consistency
    const cleanPath = imagePath.startsWith('/')
      ? imagePath.substring(1)
      : imagePath;
    return `${baseUrl}/${cleanPath}`;
  }

  /**
   * Convert image to WebP format
   * Deletes original file after conversion
   * @param inputPath - Path to original image
   * @param outputPath - Path where WebP image will be saved
   * @param quality - WebP quality (0-100, default 80)
   */
  async convertToWebp(
    inputPath: string,
    outputPath: string,
    quality = 80,
  ): Promise<void> {
    await sharp(inputPath).webp({ quality }).toFile(outputPath);

    // Clean up temporary file asynchronously
    try {
      await fs.promises.unlink(inputPath);
    } catch (error: any) {
      // Ignore error if file does not exist
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Convert image buffer to WebP format
   * Used for memory-stored uploads
   * @param buffer - Image buffer
   * @param outputPath - Path where WebP image will be saved
   * @param quality - WebP quality (0-100, default 80)
   */
  async convertBufferToWebp(
    buffer: Buffer,
    outputPath: string,
    quality = 80,
  ): Promise<void> {
    await sharp(buffer).webp({ quality }).toFile(outputPath);
  }

  /**
   * Process uploaded image file
   * Converts to WebP format with unique filename
   * @param file - Multer file object
   * @param outputDirectory - Directory where processed image will be saved
   * @returns Path to processed image
   */
  async processImage(
    file: Express.Multer.File,
    outputDirectory: string,
  ): Promise<string> {
    // Use file.originalname since file.filename might not be defined in memory storage.
    const originalName = file.filename ? file.filename : file.originalname;
    const baseName = originalName.split('.')[0];
    const uniqueSuffix = Date.now();
    const webpFilename = `${baseName}-${uniqueSuffix}.webp`;
    const outputPath = path.join(outputDirectory, webpFilename);

    // Ensure the output directory exists asynchronously
    await fs.promises.mkdir(outputDirectory, { recursive: true });

    // Convert and save the image buffer to WebP format
    await this.convertBufferToWebp(file.buffer, outputPath);

    return outputPath;
  }

  /**
   * Delete image file from filesystem
   * Silently ignores if file doesn't exist
   * @param filePath - Relative path to image file
   */
  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(__dirname, '../../../../', filePath);
    try {
      await fs.promises.unlink(fullPath);
    } catch (error: any) {
      // Ignore error if file does not exist
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
