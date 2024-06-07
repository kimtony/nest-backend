import { Module } from '@nestjs/common';


// 日志模块
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { ScheduleModule } from '@nestjs/schedule';
import { ContractsModule } from './modules/api/contracts/contracts.module';
import { HttpModule,HttpService } from '@nestjs/axios';
import { UserModule } from './modules/api/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConfig } from '@utils/config';
import { RedisModule } from '@modules/redis/redis.module';
import { TaskRunModule } from '@modules/tasks/task-run.module';
import { TaskManagementModule } from '@modules/tasks/task-management.module';
import { DatabaseModule } from '@modules/database/database.module';
import { AllExceptionsFilter } from './common/exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@modules/guard/auth.guard';
import { WsModule } from '@modules/ws/ws.module';



@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      ignoreEnvFile: false, // 忽视默认读取.env的文件配置
      isGlobal: true, // 全局注入
      load: [getConfig], // 加载配置文件
    }),
    RedisModule,
    DatabaseModule,
    TaskRunModule,
    TaskManagementModule,
    WsModule,
    HttpModule,
    UserModule
  ],
  controllers: [],
  providers: [
    {
      // 异常过滤器，格式化错误输出
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },   
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
