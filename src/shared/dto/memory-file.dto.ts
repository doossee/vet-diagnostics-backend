import { IsOptional, IsString, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiPropertyOptional({ description: 'Directory to save file in' })
  @IsOptional()
  @IsString()
  directory?: string;
}

export class MoveFileDto {
  @ApiPropertyOptional({ description: 'New directory to move file to' })
  @IsString()
  newDirectory: string;
}

export class DeleteFilesDto {
  @ApiPropertyOptional({ 
    description: 'Array of file IDs to delete',
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  fileIds: string[];
}

export class FileSearchDto {
  @ApiPropertyOptional({ description: 'Directory to search in' })
  @IsOptional()
  @IsString()
  directory?: string;

  @ApiPropertyOptional({ description: 'File extension to filter by (e.g., .jpg)' })
  @IsOptional()
  @IsString()
  extension?: string;
}
