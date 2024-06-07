/**
 * 判断任务是否是user模块任务，是的话就执行，不是的话就忽略
 */

import { isUserTask } from "@modules/api/dto/user-task.dto";


export const IsUserTask = () => {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            if (isUserTask(args[0])) {
                return originalMethod.apply(this, args);
            } else {
                return;
            }
        };
        return descriptor;
    };
};