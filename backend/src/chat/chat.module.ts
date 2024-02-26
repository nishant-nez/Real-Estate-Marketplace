import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RoomService } from './service/room-service/room.service';
import { RoomEntity } from './entities/room.entity';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { ConnectedUserEntity } from './entities/connected-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RoomEntity, ConnectedUserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [ChatGateway, RoomService, ConnectedUserService],
})
export class ChatModule {}
