import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RedisPoolProvider } from './redis-pool.provider';

@Injectable()
export class RedisService {
    private client: Redis;
    private REDIS_KEY: string; //redis唯一标识前缀
    private lastClient: Redis; // 保存上次获取的客户端

    constructor(
        private readonly configService: ConfigService,
        private readonly redisPool: RedisPoolProvider
    ) {
        this.REDIS_KEY = this.configService.get('redis.pre_key');
        // this.getClient(); // 在构造函数中获取客户端
    }


    /**
     * 获取redis客户端
     */
    private async getClient() {
        return await this.redisPool.acquire();
    }

    /**
     * 释放
     * @param client 
     */
    private async releaseClient(client: Redis): Promise<void> {
        
        if (client) { // 使用上次获取的客户端来释放
            await this.redisPool.release(client);
        }
    }
    /**
      * 创建一个缓存,如果原有缓存存在过期时间，则自动沿用剩余过期时间
      * @param key 键
      * @param value 值
      * @param seconds 过期时间，s
      * @param cover 覆盖之前的时间，默认沿用之前的剩余时间
      */
    async set(key: string, value: any, seconds?: number, cover = false): Promise<void> {
        const client = await this.getClient();
        try {
            if (!seconds) {
                const ttl = await client.ttl(this.REDIS_KEY + key);
                if (ttl > 0 && !cover) {
                    await client.set(this.REDIS_KEY + key, value, 'EX', ttl);
                } else {
                    await client.set(this.REDIS_KEY + key, value);
                }
            } else {
                await client.set(this.REDIS_KEY + key, value, 'EX', seconds);
            }
        } finally {
            await this.releaseClient(this.client);
        }
    }
    /**
   * 获取过期剩余时间
   * @param key 
   * @returns 剩余秒
   */
    async getRemainingTime(key: string): Promise<number> {
        const client = await this.getClient();
        try {
            return await client.ttl(this.REDIS_KEY + key);
        } finally {
            await this.releaseClient(this.client);
        }
    }
    /**
  * 获取redis缓存
  * @param key 键
  * @returns 
  */
    async get(key: string): Promise<any> {
        const client = await this.getClient();
        try {
            const data = await client.get(this.REDIS_KEY + key);
            return data ? data : null;
        } finally {
            await this.releaseClient(this.client);
        }
    }
    /**
  * 删除一条缓存
  * @param key 键
  */
    async del(key: string): Promise<void> {
        const client = await this.getClient();
        try {
            await client.del(this.REDIS_KEY + key);
        } finally {
            await this.releaseClient(this.client);
        }
    }


    /**
* 清空缓存数据
*/
    async flushall(): Promise<void> {
        const client = await this.getClient();
        try {
            await client.flushall();
        } finally {
            await this.releaseClient(this.client);
        }
    }
}