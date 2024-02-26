import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/chat/entities/room.entity';
import { RoomI } from 'src/chat/interface/room.interface';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async createRoom(room: RoomI, creator: User): Promise<RoomI> {
    const newRoom = await this.addCreatorToRoom(room, creator);
    return this.roomRepository.save(newRoom);
  }

  async getRoomsForUser(userId: number): Promise<RoomI[]> {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.users', 'user')
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .select([
        'room',
        'all_users.id',
        'all_users.name',
        'all_users.email',
        'all_users.avatar',
        'all_users.date',
      ])
      .orderBy('room.updated_at', 'DESC');

    return query.getMany();
  }

  async addCreatorToRoom(room: RoomI, creator: User): Promise<RoomI> {
    room.users.push(creator);
    return room;
  }
}
