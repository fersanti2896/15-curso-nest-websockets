import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
    @ApiProperty({
        example: '259fcb28-9c70-4049-86b1-51d285fcf505',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Pants Small',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product Price'
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'It is a product',
        description: 'Product Description',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 'pants_small',
        description: 'Product Slug',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string

    @ApiProperty({
        example: 0,
        description: 'Product Stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'XL', 'XLL'],
        description: 'Product Sizes'
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'men',
        description: 'Product Gender'
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['pants', 'small', 'black'],
        description: 'Product Tags'
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty({
        example: ['http://image1.png'],
        description: 'Product Images'
    })
    @OneToMany(
        () => ProductImage,
        ( productImage ) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User

    @BeforeInsert()
    checkSlugInsert() {
        if( !this.slug ) { this.slug = this.title; }

        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }
}
