import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { ConnectedClients } from './interfaces/connecte-clients.interface';

@Injectable()
export class MessagesWsService {
    /* Almacena todos los clientes - sockets */
    private connectedClients: ConnectedClients = {}

    constructor( 
        @InjectRepository( User )
        private readonly userRepository: Repository<User> 
    ) {}

    async registerClient( client: Socket, userId: string ) {
        const user = await this.userRepository.findOneBy({ id: userId });

        if( !user ) throw new Error('Usuario no encontrado.');
        if( !user.isActive ) throw new Error('Usuario no activo.');

        this.connectedClients[client.id] = {
            socket: client,
            user
        };
    }

    removeClient( clientId: string ) {
        delete this.connectedClients[clientId];
    }

    getConnectedClients(): string[] {
        return Object.keys( this.connectedClients );
    }

    getUserFullNameBySocket( socketId: string ) {
        return this.connectedClients[socketId].user.fullName;
    }
}
