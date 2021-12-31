import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import jwt from 'jsonwebtoken';
import ldap from 'ldapjs';
import { Repository } from 'typeorm';

import { SECRET } from '../config';
import { LoginUserDto } from './dto';
import { UserInfoType } from './user.decorator';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  generateJWT(user: UserEntity) {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      SECRET,
      { expiresIn: '30 days' },
    );
  }

  async ldapLogin(useInfo: LoginUserDto): Promise<UserEntity | null> {
    // 域账户登陆
    const loginResult = await this.autenticarDN(
      `uniubi\\${useInfo.username}`,
      useInfo.password,
    );
    // 如果登陆登陆成功了，如果用户还没在库里，就新建用户，权限最低
    if (loginResult) {
      const user = await this.userRepository.findOne({
        where: { username: useInfo.username },
      });

      if (!user) {
        const newUser = new UserEntity();
        newUser.username = useInfo.username;
        newUser.role = 0;
        try {
          // insert also updates id of newUser, we can directly return newUser
          await this.userRepository.insert(newUser);
        } catch (err) {
          console.log(err);
          throw new ConflictException();
        }
        return newUser;
      } else {
        return user;
      }
    } else {
      return null;
    }
  }

  async findUser(useInfo: UserInfoType): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { username: useInfo.username },
    });
    return user;
  }

  private autenticarDN(username, password): Promise<boolean> {
    return new Promise(resolve => {
      const client = ldap.createClient({
        url: 'ldap://192.168.1.2',
      });
      client.bind(username, password, err => {
        if (err) {
          resolve(false);
        }
        resolve(true);
      });
    });
  }

  private buildUserRO(user) {
    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      token: this.generateJWT(user),
      image: user.image,
    };

    return { user: userRO };
  }
}
