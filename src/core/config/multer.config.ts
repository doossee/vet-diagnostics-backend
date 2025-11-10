/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { diskStorage, memoryStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { join } from 'path';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

const uploadDir = join(process.cwd(), 'uploads/files');

export const multerDiskConfig: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      } catch (error) {
        console.error(`Failed to create upload directory: ${error.message}`);
        // Use BadRequestException here instead of a generic Error.
        cb(
          new BadRequestException('Could not create upload directory'),
          uploadDir,
        );
      }
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const originalName = file.originalname.split('.')[0];
      const extension = file.mimetype.split('/')[1];
      cb(null, `${originalName}-${uuidv4()}.${extension}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    // Check if the mimetype matches allowed document types
    if (!file.mimetype.match(/\/(pdf|docx|docm|doc)$/)) {
      return cb(
        new BadRequestException('Only document files are allowed!'),
        false,
      );
    }
    cb(null, true);
  },
};

export const multerMemConfig: MulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return cb(
        new BadRequestException('Only image files are allowed!'),
        false,
      );
    }
    cb(null, true);
  },
};
