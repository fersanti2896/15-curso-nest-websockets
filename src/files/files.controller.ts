import { Controller, Get, Post, UploadedFile, UseInterceptors, BadRequestException, Param, Res } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImage( @Res() res: Response, @Param('imageName') imageName: string ) {
    const path = this.filesService.getStaticProductImage( imageName )

    res.sendFile( path );
  }

  @Post('product')
  @UseInterceptors( FileInterceptor( 'file', {
    fileFilter: fileFilter,
    // limits: { fieldSize: 1000 },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  } ) )
  uploadProductFile( @UploadedFile() file: Express.Multer.File ) {
    if( !file ) {
      throw new BadRequestException('El archivo debe ser una imagen.');
    }
    
    // const secureURL = `${ file.filename }`
    const secureURL = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;

    return {
      secureURL
    }
  }
}
