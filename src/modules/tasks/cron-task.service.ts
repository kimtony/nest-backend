import { BeforeApplicationShutdown, Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '@modules/redis/redis.service';
import { UUID } from '@utils/random';
import { UserTaskService } from '@modules/api/user/user-task.service';
import { logger } from '@common/logger';

const CRON_TASK_KEY = 'CRON_TASK_WORKER_ID';
@Injectable()
export class CronTaskService implements OnApplicationBootstrap {
    static workerID = UUID();

    constructor(
        private redisService: RedisService,
        private userTaskService: UserTaskService,
    ) { };
    async CanWorker(): Promise<Boolean> {
        const worker = await this.redisService.get(CRON_TASK_KEY);
        if (worker) {
            return worker == CronTaskService.workerID;
        } else {
            await this.redisService.set(CRON_TASK_KEY, CronTaskService.workerID);
            return await this.CanWorker();
        }
    }
    /**
     * Cron表达式生成
     * 文档参考：https://nestjs.bootcss.com/techniques/task-scheduling
     */
    /**
     * 每月1号0点,执行一次
     */
    @Cron(
        CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT,
        { timeZone: "Asia/Shanghai" }
    )
    async atMidnightOnTheFirstDayOfEachMonth() {
        if (await this.CanWorker()) {
            logger.info("每月执行一次")
            await this.userTaskService.runMonth();
        } else {
            logger.info("每月执行一次，当前副本无权执行")
        }
    }

    @Cron(
        CronExpression.EVERY_DAY_AT_MIDNIGHT,
        { timeZone: "Asia/Shanghai" }
    )
    async everyDayAt() {
        if (await this.CanWorker()) {
            logger.info("每天零点执行一次");
            await this.userTaskService.runDay();
        } else {
            logger.info("每天零点执行一次，当前副本无权执行");
        }
    }
    onApplicationBootstrap() {
        this.redisService.set(CRON_TASK_KEY, CronTaskService.workerID);
        setTimeout(() => {
            // 启动就执行一次,延迟8s执行
            this.atMidnightOnTheFirstDayOfEachMonth();
            this.everyDayAt();
        }, 5000);
    }
}

