import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNumber, IsPositive, IsOptional, IsInt, IsArray, IsIn } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        description: 'Título del producto',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'Precio del producto'
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'Descripción del producto'
    })
    @IsString()
    @IsOptional()
    description?: string;
    
    @ApiProperty({
        description: 'Slug del producto'
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'Stock del producto'
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'Tallas del producto'
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[]
    
    @ApiProperty({
        description: 'Género del producto'
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        description: 'Tags del producto'
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty({
        description: 'Imágenes del producto'
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
