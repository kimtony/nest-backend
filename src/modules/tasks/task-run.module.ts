import { Module } from '@nestjs/common';
import { RunTaskService } from './run-task.service';
import { CronTaskService } from './cron-task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { CreateTaskService } from './create-task.service';
import { RedisModule } from '@modules/redis/redis.module';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { UserModule } from '@modules/api/user/user.module';



@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,  // 确保 ConfigModule 是全局模块
        }),
        ScheduleModule.forRoot(),
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            useFactory: (configService: ConfigService) => {
                return {
                    uri: configService.get<string>('rabbitmq.uri'),
                    enableControllerDiscovery: true,
                }

            },
            inject: [ConfigService],  // 注入 ConfigService
        }),
        RedisModule,
        UserModule
    ],
    providers: [CronTaskService, CreateTaskService, RunTaskService],
    exports: [CronTaskService, RunTaskService],
    controllers: []
})
export class TaskRunModule { }

