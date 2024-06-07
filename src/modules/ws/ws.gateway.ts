// chat.gateway.ts
import { USER_TASK_TYPE, UserTaskDto } from '@modules/api/dto/user-task.dto';
import { CreateTaskService } from '@modules/tasks/create-task.service';
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { NowTimeStamp } from '@utils/date';
import { Server, Socket } from 'socket.io';


//1.断线重连的旧消息推送 2.主动性心跳检测
interface Message {
    clientId: string;
    content: string;
    timestamp: number;
}

@WebSocketGateway({
    pingInterval: 25000, // 每25秒发送一次心跳包
    pingTimeout: 60000, // 超过60秒没有收到心跳包则断开连接
})
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    private server: Server;
    private messageHistory: Map<string, Message[]> = new Map();
    constructor(private readonly createTaskService: CreateTaskService) {}

    afterInit(server: Server) {
        this.server = server;
        console.log('WebSocket server initialized');
    }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);

        // 推送旧消息
        if (this.messageHistory.has(client.id)) {
            const messages = this.messageHistory.get(client.id);
            messages.forEach(message => client.emit('message', message));
       }
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    /**
     * 监听订阅消息
     * @param message 
     * @param client 
     */
    @SubscribeMessage('message')
    async handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket) {
        const clientId = client.id;

        console.log(`Message from client ${clientId}: ${message}`);


        await this.createTaskService.createTask(new UserTaskDto(
            clientId,
            USER_TASK_TYPE.online,
            client.id
        ))

        // 消息广播
        // this.server.emit('message', message);

        //指定id发消息
        this.server.to(clientId).emit('message', message);

        // 存储消息历史
        if (!this.messageHistory.has(clientId)) {
            this.messageHistory.set(clientId, []);
        }
        const messagesArr = this.messageHistory.get(clientId);

        // 保持消息历史在限制范围内
        if (messagesArr.length >= 100) {
            messagesArr.shift(); // 移除最早的一条消息
        }
    
        messagesArr.push({clientId,content:message,timestamp:new Date().getTime()})
    }


    /**
     * 加入房间
     * @param room 
     * @param client 
     */
    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
        console.log(`Client ${client.id} joined room: ${room}`);
        client.join(room);
    }

    /**
     * 房间消息
     * @param data 
     * @param client 
     */
    @SubscribeMessage('roomMessage')
    handleRoomMessage(@MessageBody() data: { room: string, message: string }, @ConnectedSocket() client: Socket): void {
        const { room, message } = data;
        console.log(`Message from client ${client.id} to room ${room}: ${message}`);
        this.server.to(room).emit('roomMessage', message);
    }
}
