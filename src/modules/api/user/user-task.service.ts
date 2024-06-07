import { Injectable, Logger } from "@nestjs/common";
import { TaskRunService } from "@modules/tasks/dto/task-service.interface";
import { TaskDto } from "@modules/tasks/dto/task.dto";
import { USER_TASK_TYPE, UserTaskCommand } from "../dto/user-task.dto";
import { UserService } from "./user.service";
import { IsUserTask } from "@src/common/decorator/is-user-task.decorator";
import { CurlService } from "@modules/curl/curl.service";
import { logger } from "@src/common/logger";

/**
 * 任务防抖
 */
const antiShake: TaskDto<UserTaskCommand>[] = [];
@Injectable()
export class UserTaskService implements TaskRunService {
    private readonly logger = new Logger(UserTaskService.name);
    private readonly req = { userName: '系统-会员任务' }

    constructor(
        private userService: UserService,
        private curlService: CurlService,

    ) { }
    async runDay(): Promise<void> {
        console.log('everyDayAt');
    }

    @IsUserTask()
    async run(task: TaskDto<UserTaskCommand>): Promise<void> {
        antiShake.push(task);
        const runTask = async () => {
            if (antiShake.length > 0) {
                const { data } = antiShake.pop();
                const start = new Date();
                switch (data.type) {
                    case USER_TASK_TYPE.online:
                        // await this.userService.updateOnlineStatus(data.UUID, data.data, this.req);
                        break;
                    case USER_TASK_TYPE.offline:
                        // await this.userService.updateOnlineStatus(data.UUID, "", this.req);
                        break;
                }
                logger.info(`耗时：${((new Date().getTime() - start.getTime()) / 1000).toFixed(2)}s`)
                await runTask();
            }
        }
        await runTask();
    }


    async runMonth(): Promise<void> {
        const res = await this.curlService.getBscData();
        // console.log(res);
    }




}