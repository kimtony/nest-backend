import { TaskDto } from "@modules/tasks/dto/task.dto"

const TASK_TAG = 'user_task';
export class UserTaskDto extends TaskDto<UserTaskCommand> {
    constructor(UUID: string, type: USER_TASK_TYPE, socketId: string, msg?: string) {
        super();
        this.tag = TASK_TAG;
        this.message = msg;
        this.data = new UserTaskCommand();
        this.data.UUID = UUID;
        this.data.type = type;
        this.data.typeText = USER_TASK_TYPE_TEXT[type];
        this.data.data = socketId;
    }
}
export const isUserTask = (t: TaskDto<any>) => {
    return t.tag === TASK_TAG;
}
export enum USER_TASK_TYPE {
    'online' = 1,
    'offline' = 2,
}
const USER_TASK_TYPE_TEXT = {
    1: 'user_online',
    2: 'user_offline',
}
export class UserTaskCommand {
    /**
     * 命令类型
     */
    type: string | USER_TASK_TYPE;
    typeText: string;
    /**
     * 会员UUID
     */
    UUID: string;
    /**
     * 传输数据
     */
    data: any;
}
