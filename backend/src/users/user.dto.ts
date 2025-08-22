export interface CreateUserDto {
  email: string;
  password: string;
  role?: "user" | "admin";
}

export interface LoginUserDto {
  email: string;
  password: string;
}
