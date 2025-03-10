export * from './auth.service';
import { AuthService } from './auth.service';
export * from './default.service';
import { DefaultService } from './default.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [AuthService, DefaultService, UserService];
