import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() ws: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService, 
    private readonly jwtService: JwtService
  ) {}
 
  async handleConnection( client: Socket ) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload
    
    try {
      payload = this.jwtService.verify( token );
      await this.messagesWsService.registerClient( client, payload.id );
    } catch (error) {
      client.disconnect();

      return;
    }

    // console.log({ payload })

    this.ws.emit( 'clients-updated', this.messagesWsService.getConnectedClients() )
  }

  handleDisconnect( client: Socket ) {
    this.messagesWsService.removeClient( client.id );
    this.ws.emit( 'clients-updated', this.messagesWsService.getConnectedClients() )
  }

  @SubscribeMessage('message-from-client')
  async handleMessageFromClient( client: Socket, payload: NewMessageDto ) {
    /* Emite únicamente al cliente */
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo!',
    //   message: payload.message || 'no message'
    // });

    /* Emite a todos menos al cliente inicial */
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo!',
    //   message: payload.message || 'no message'
    // });

    /* Emite a todos */
    this.ws.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullNameBySocket( client.id ),
      message: payload.message || 'no message'
    });
  }
}
