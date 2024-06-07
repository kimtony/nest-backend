import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule,ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // mysql
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('db.host'),
          port: configService.get('db.port'),
          username: configService.get<string>('db.username'),
          password: configService.get<string>('db.password'),
          database:  configService.get<string>('db.database'),
          entityPrefix: configService.get<string>('db.prefix'),
          entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
          synchronize: false,
          logging: true,
          maxQueryExecutionTime: 1000,
          cache: {
            duration: 60000, // 1分钟的缓存
          },
          // extra: {
          //   poolMax: 32,
          //   poolMin: 16,
          //   queueTimeout: 60000,
          //   pollPingInterval: 60, // 每隔60秒连接
          //   pollTimeout: 60, // 连接有效60秒
          // },
        }
      },
      inject: [ConfigService],  // 注入 ConfigService
      }),
  ],
})
export class DatabaseModule {}
