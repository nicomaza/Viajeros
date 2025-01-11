// src/app/models/AdminUserUpdateResponseDto.ts
export interface AdminUserUpdateResponseDto {
    password: string;
    name: string;
    lastname: string;
    email: string;
    bank: string;
    cbu: string;
    cuil: string;
    phone: number;
    deleted: boolean;
    blocked: boolean;
    commentBlocked: string;
    rol: string;
  }
  