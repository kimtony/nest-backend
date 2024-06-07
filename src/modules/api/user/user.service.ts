import { Injectable,Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@modules/api/entity/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { 
    
  };

    /**
   * 修改用户在线状态
   * @param UUID 用户UUID
   * @param clientId 不为空则在线，为空则不在线
   * @param req 
   * @returns 
   */
    async updateOnlineStatus(UUID: string, socketId: string, req: any): Promise<any> {
      const user = await this.getDetailByUUID(UUID);
      if (user) {
          return await this.update(user, user.user_id, req);
      }
    }

  async getDetailByUUID(UUID: string): Promise<User> {
    let map: any = { UUID }
    return await this.userRepository.findOne(map);
  }


  async update(data: User, id: number, req: any): Promise<any> {
    const user = new User();
    return await this.userRepository.update(id,user)
  }


  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
  
}
