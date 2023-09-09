import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities';

@Entity('users')
export class User {
    @ApiProperty({
        example: '259fcb28-9c70-4049-86b1-51d285fcf505',
        description: 'User ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'prueba@test.com',
        description: 'User Email',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    email: string;

    @ApiProperty({
        example: 'Abc123;',
        description: 'User Password'
    })
    @Column('text', {
        select: false
    })
    password: string;

    @ApiProperty({
        example: 'Prueba Test Apellido',
        description: 'User Fullname',
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        example: true,
        description: 'User IsActive',
        default: true
    })
    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @ApiProperty({
        example: ['user', 'admin'],
        description: 'User Roles',
        default: ['user']
    })
    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        () => Product,
        ( product ) => product.user
    )
    product: Product

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
