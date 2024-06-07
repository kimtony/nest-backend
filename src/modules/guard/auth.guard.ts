import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    Next,
  } from '@nestjs/common';
  import { RedisService } from '@modules/redis/redis.service';
  import { getUrlQuery } from '@utils/url';
  import { isExistInArr, unique } from '@utils/array';
  

  // 不需要token验证
  const apiNotAuthArr = [ '/','/user'];
  

  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private readonly redisService: RedisService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        let token;
        if (context.switchToRpc().getData().headers || context.switchToHttp().getRequest().body) {
            token = context.switchToRpc().getData().headers.token || context.switchToHttp().getRequest().body.token || getUrlQuery(request.url, 'token');
        }
        const pass = isExistInArr(apiNotAuthArr,request.url);
        if (pass) {
            return true;
        }
        // 需要token验证
        if (!token) {
            throw new HttpException( { message: '你还没登录,请先登录' },HttpStatus.UNAUTHORIZED );
        }

        // 如果传递了token的话就要从redis中查询是否有该token
        const result = await this.redisService.get(token);
        if (!result) {
            // 如果 Redis 中没有对应的用户信息，则抛出异常
            throw new HttpException({ message: '你还没登录，请先登录' }, HttpStatus.UNAUTHORIZED);
        }

        // 将用户信息存储到请求中，方便后续使用
        request.user = result;
        return true;

    }
  }
