import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { createPool, Pool } from 'generic-pool';

@Injectable()
export class RedisPoolProvider implements OnModuleDestroy {
  private pool: Pool<Redis>;

  constructor(private readonly configService: ConfigService) {

  }


  onModuleDestroy() {
    this.pool.drain().then(() => this.pool.clear());
  }

  async acquire(): Promise<Redis> {
    const factory = {
      create: async () => {
        const client = new Redis({
          port: Number(this.configService.get('redis.port')),
          host: this.configService.get('redis.host'),
          password: this.configService.get('redis.password'),
          db: Number(this.configService.get('redis.db')),
          keepAlive: 300000,
          retryStrategy: times => Math.min(times * 100, 3000),
          maxRetriesPerRequest: 10,
          connectTimeout: 100000,
          family: 4,
          enableReadyCheck: true,
          enableOfflineQueue: true,
          lazyConnect: true,
        });
        await client.connect();
        return client;
      },

      destroy: async (client: Redis) => {
          await client.quit();
      },

      };

    this.pool = createPool(factory, {
        max: 10000, // 最大连接数
        min: 2, // 最小连接数
        idleTimeoutMillis: 30000, // 空闲连接超时时间
    });
    return this.pool.acquire();
  }

  async release(client: Redis): Promise<void> {
    return this.pool.release(client);
  }
}
