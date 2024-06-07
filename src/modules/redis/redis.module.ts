import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisPoolProvider } from './redis-pool.provider';
@Module({
  providers: [RedisPoolProvider,RedisService,],
  exports: [RedisPoolProvider,RedisService,],
})
export class RedisModule { }