import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CurlService } from './curl.service';


@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [CurlService],
  exports: [CurlService],

})
export class CurlModule {}
