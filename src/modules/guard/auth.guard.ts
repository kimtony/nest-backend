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
        // const request = context.switchToHttp().getRequest();
        // const token = context.switchToRpc().getData().headers.token || context.switchToHttp().getRequest().body.token || getUrlQuery(request.url, 'token');
        // const pass = isExistInArr(apiNotAuthArr,request.url);
        // if (pass) {
        //     return true;
        // }else{
        //     // 需要token验证
        //     if (!token) {
        //         // 如果传递了token的话就要从redis中查询是否有该token
        //         const result = await this.redisService.get(token);
        //         if (result) {
        //             // 这里我们知道result数据类型就是我们定义的直接断言
        //             request.user = result;
        //             return true;
        //         } else {
        //             throw new HttpException( { message: '你还没登录,请先登录' },HttpStatus.UNAUTHORIZED );
        //         }
        //     }else{
        //         throw new HttpException( { message: '你还没登录,请先登录' },HttpStatus.UNAUTHORIZED );
        //     }
        // }
        return true;

    }
  }