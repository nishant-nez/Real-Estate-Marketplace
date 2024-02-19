import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import { UserGuard } from './user.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.userService.login(createUserDto, response);
  }

  @Get()
  user(@Req() request: Request) {
    return this.userService.user(request);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.userService.logout(response);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get('guard')
  @UseGuards(UserGuard)
  testGuard(@Req() request: Request) {
    console.log('guard');
    return this.userService.user(request);
    // return 'guard test';
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    return this.userService.update(+id, updateUserDto, request);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.userService.remove(+id, request);
  }
}
