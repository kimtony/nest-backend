import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RequestMiddleware } from '@common/request.middleware';
import helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 请求处理中间件：处理 traceID
  app.use(RequestMiddleware);

  // #region 基础安全配置及访问限制配置
  //避免常见请求头攻击
  app.use(helmet());

  //信任proxy设置的头文件
  app.set('trust proxy', 1);
  //限速每个ip固定时间内仅能访问多少次
  // 限制：同一个ip，20次/秒
  // app.use(
  //   rateLimit({
  //     // 1 分钟
  //     windowMs: 1 * 1000,
  //     // 每个ip最多：max次/windowMs毫秒
  //     max: 20,
  //   }),
  // );

  //跨域
  app.enableCors();

  await app.listen(process.env.NEST_SERVER_PORT || 8000);
}
bootstrap();
