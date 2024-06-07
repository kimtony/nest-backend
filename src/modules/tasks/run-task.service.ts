import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { UserTaskService } from '@modules/api/user/user-task.service';
import { logger } from '@src/common/logger';

@Injectable()
export class RunTaskService {
    constructor(
        private userTaskService: UserTaskService
    ) { };

    @RabbitSubscribe({
        exchange: 'demo-task-exchange',
        routingKey: 'bg-task',
        queue: 'demo-task',
    })
    public async handlerTask(message: any) {
        const task: TaskDto<any> = typeof message === 'string' ? JSON.parse(message) : message;
        console.log(`收到任务`, task);
        logger.info(`收到任务`, task);
        /**
         * 通知所有任务,任务中的run通过注解过滤，获取自己的消息
         */
        await this.userTaskService.run(task);
    }
}
