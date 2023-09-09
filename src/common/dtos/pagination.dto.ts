import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator'

export class PaginationDto {
    @ApiProperty({
        default: 10,
        description: 'Limite de productos a mostrar.'
    })
    @IsOptional()
    @IsPositive()
    @Type( () => Number )
    limit?: number;

    @ApiProperty({
        default: 0,
        description: 'De que valor empieza el producto.'
    })
    @IsOptional()
    @Min(0)
    @Type( () => Number )
    offset?: number;
}