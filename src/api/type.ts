import {Store} from '../scripts/store';
import Router from '../core/router';

declare global {
  interface Window {
    store: Store;
    router: Router;
  }
}

export type APIError = {
  reason: string;
  message: string;
};

export type SignUpResponse = {
  id: number
}

export type UserDTO = {
  id: number;
  name: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  avatar: string;
  phone: string;
  email: string;
};

export type CreateUser = Omit<UserDTO, 'avatar' | 'display_name' | 'id'> & {
  password: string
}

export type CreateChat = {
  title: string
}

export type LoginRequestData = {
  login: string,
  password: string
}

type LastMessage = {
  user: UserDTO,
  time: string,
  content: string
}

export type ChatDTO = {
  id: number,
  title: string,
  avatar: string | null,
  unread_count: number,
  last_message: LastMessage | null,
  click: any
}

export interface UpdateUserProfileRequest {
  first_name: string;
  second_name: string;
  display_name?: string;
  login: string;
  email: string;
  phone: string;
}

export interface FindUserRequest {
  login: string;
}

export interface UpdateUserPasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateUserAvatarRequest {
  avatar: File;
}

export interface Message {
  user_id: number;
  content: string;
  id: number;
  chat_id: number;
  type: string;
  time: string;
  message: string;
}

export interface State {
  messages?: Message[];
  userId?: number;
  isLoading?: boolean;
  loginField?: string;
  loginError?: string;
  passwordField?: string;
  user?: User;
  updateError?: string | null;
  updatePasswordError?: string | null;
  updateAvatarError?: string | null;
  [key: string]: any;
}

export interface User {
  id: number;
  name: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  avatar: string;
  phone: string;
  email: string;
  [key: string]: any;
}
