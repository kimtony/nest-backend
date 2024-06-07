import { Module } from '@nestjs/common';
import { CreateTaskService } from './create-task.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { TaskTestController } from './task-test.controller';
@Module({
    imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            useFactory: (configService: ConfigService) => {
                return {
                    exchanges: [
                        {
                            name: 'demo-task-exchange',
                            type: 'x-delayed-message',
                            options: {
                                arguments: { 'x-delayed-type': 'direct' }
                            }
                        }
                    ],
                    uri: configService.get<string>('rabbitmq.uri'),
                    enableControllerDiscovery: true,
                }
            },
            inject: [ConfigService],  // 注入 ConfigService
        }),
    ],
    providers: [CreateTaskService],
    exports: [CreateTaskService],
    controllers: [TaskTestController]
})
export class TaskManagementModule { }
