// chat.module.ts
import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { TaskManagementModule } from '@modules/tasks/task-management.module';

@Module({
  imports:[
    TaskManagementModule
  ],
  providers: [WsGateway],
})
export class WsModule {}
