import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserTaskService } from './user-task.service';
import { CurlModule } from '@modules/curl/curl.module';


@Module({
  imports: [
    CurlModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService,UserTaskService],
  exports: [UserService,UserTaskService],

})
export class UserModule {}
