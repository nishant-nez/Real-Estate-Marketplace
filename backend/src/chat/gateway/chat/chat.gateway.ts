import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectedUserI } from 'src/chat/interface/connected-user.interface';
import { RoomI } from 'src/chat/interface/room.interface';
import { ConnectedUserService } from 'src/chat/service/connected-user/connected-user.service';
import { RoomService } from 'src/chat/service/room-service/room.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000', 'https://hoppscotch.io'],
  credentials: true,
};

@WebSocketGateway({
  cors: corsOptions,
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly roomService: RoomService,
    private readonly connectedUserService: ConnectedUserService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
  }

  @WebSocketServer()
  server: Server;

  title: string[] = [];

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    this.server.emit('message', 'subscribe test');
    // return 'Hello world!';
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI) {
    console.log('createRoom called');
    console.log('room', room);
    // return this.roomService.createRoom(room, socket.data.user);
    const createdRoom: RoomI = await this.roomService.createRoom(
      room,
      socket.data.user,
    );

    for (const user of createdRoom.users) {
      const connections: ConnectedUserI[] =
        await this.connectedUserService.findByUser(user);
      const rooms = await this.roomService.getRoomsForUser(user.id);
      for (const connection of connections) {
        console.log('connection: ', connection);
        await this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }

  async handleConnection(socket: Socket) {
    try {
      // const token = socket.handshake.headers.cookie
      const token = socket.handshake.headers.cookie;
      const match = token.match(/jwt=([^;]+)/);
      const decodedToken = match ? match[1] : null;
      console.log('token: ', token);
      console.log('jwt: ', decodedToken);
      const data = await this.jwtService.verifyAsync(decodedToken);
      console.log('jwt data', data);
      if (!data) throw new UnauthorizedException();

      const user: User = await this.userRepository.findOne({
        where: { id: data.id },
      });
      if (!user) {
        // disconnect
        console.log('disconnected by if(!user)');
        return this.disconnect(socket);
      } else {
        console.log('On Connect');
        console.log('user: ', user);
        socket.data.user = user;
        const rooms = await this.roomService.getRoomsForUser(user.id);

        // save connection to DB
        await this.connectedUserService.create({ socketId: socket.id, user });

        // only emit rooms to the specific connected client
        return this.server.to(socket.id).emit('rooms', rooms);
        // this.title.push('Value ' + Math.random().toString());
        // this.server.emit('message', this.title);
      }
    } catch (error) {
      // disconnect
      console.log('disconnected by catch (error)');
      this.disconnect(socket);
      console.log('Error: ', error);
    }
  }

  async handleDisconnect(socket: Socket) {
    // remove connection from DB
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
    console.log('On Disconnect');
  }

  private async disconnect(socket: Socket) {
    // await this.connectedUserService.deleteBySocketId(socket.id);
    // console.log('handle disconnect called');
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
