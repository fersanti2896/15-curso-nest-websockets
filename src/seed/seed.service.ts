import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts( adminUser );

    return 'SEED EXECUTED'
  }

  /* Insertar usuarios */
  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach( user => {
      users.push( this.userRepository.create( user ) );
    } );

    const dbUsers = await this.userRepository.save( seedUsers );

    return dbUsers[0];
  }

  /* Purga las todas las tablas en BD */
  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertNewProducts( user: User ) {
    await this.productsService.deleteAllProducts();

    const seedProducts = initialData.products;
    const insertPromises = [];

    seedProducts.forEach( product => {
      insertPromises.push( this.productsService.create(product, user) );
    } );

    await Promise.all( insertPromises );

    return true;
  }
}
