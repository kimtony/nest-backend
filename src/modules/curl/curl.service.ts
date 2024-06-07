import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { map,firstValueFrom  } from 'rxjs'
import axios, { AxiosInstance,AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

@Injectable()
export class CurlService {


    private readonly axiosInstance: AxiosInstance;

    constructor(
        private httpService: HttpService

    ) {
      this.axiosInstance = axios.create({
        timeout: 10000, // 设置超时时间为 10 秒
      });
  
      axiosRetry(this.axiosInstance, { retries: 3 }); // 配置重试机制
    }
  
    async get(url: string, config?: AxiosRequestConfig) {
        const response = await firstValueFrom(this.httpService.get(url, config));
        return response.data;
    }
    
    async post(url: string, data: any, config?: AxiosRequestConfig) {
        const response = await firstValueFrom(this.httpService.post(url, data, config));
        return response.data;
    }

    /**
     * 获取bsc合约交易数据
     * @returns 
     */
    async getBscData(): Promise<any>{
        const api = 'https://api.bscscan.com/api';
        const address = '0x99817ce62abf5b17f58e71071e590cf958e5a1bf';
        const contractaddress = '0x55d398326f99059fF775485246999027B3197955';
        const apikey = 'JKSH56GFG3P9W8P22Q2ZTFKBFK5PJ1IF4U';
        const module = 'account';
        const action = 'tokentx';
        const url = `${api}?module=${module}&action=${action}&address=${address}&contractaddress=${contractaddress}&page=1&offset=100&apikey=${apikey}`;
        return await this.get(url);
    }
}

