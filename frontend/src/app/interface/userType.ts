export interface UserType {
  id: number;
  name: string;
  email: string;
  phone: number | null;
  role: number;
  avatar: string;
  created_at: Date;
  updated_at: Date;
}
