export class CreateUserDto {
  email: string;

  name: string;

  password: string;

  role: number;

  created_at?: Date;

  updated_at?: Date;
}
