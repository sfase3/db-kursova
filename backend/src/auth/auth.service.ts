import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, of, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  validateUser(authPayload: AuthPayloadDto): Observable<User> {
    return from(this.userService.getUserByEmail(authPayload.email)).pipe(
      switchMap((user: User) => {
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        return from(
          bcrypt.compare(authPayload.password, user.hashedPassword),
        ).pipe(
          switchMap((passwordEquals: boolean) => {
            if (passwordEquals) {
              return of(user);
            } else {
              throw new UnauthorizedException('Wrong credentials');
            }
          }),
        );
      }),
      catchError((error) => throwError(error)),
    );
  }

  login(authPayload: AuthPayloadDto): Observable<string> {
    return this.validateUser(authPayload).pipe(
      switchMap((user: User) => this.generateToken(user)),
    );
  }

  registration(authPayload: AuthPayloadDto): Observable<string> {
    return from(this.userService.getUserByEmail(authPayload.email)).pipe(
      switchMap((candidate: User | null) => {
        if (candidate) {
          return throwError(
            new HttpException('Email already exists', HttpStatus.BAD_REQUEST),
          );
        }
        return from(bcrypt.hash(authPayload.password, 5)).pipe(
          switchMap((hashedPassword: string) =>
            this.userService.create({
              ...authPayload,
              hashedPassword,
            }),
          ),
          switchMap((user: User) => {
            return this.generateToken(user);
          }),
          catchError((error) => throwError(error)),
        );
      }),
    );
  }

  private generateToken(user: User): Observable<string> {
    const payload = {
      username: user.username,
      email: user.email,
      id: user.id,
      roles: user.roles,
      isBanned: user.isBanned,
    };
    return from(this.jwtService.signAsync(payload));
  }
}
