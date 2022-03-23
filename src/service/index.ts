import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { IRequestInterceptors, IRequestConfig } from './type';

import { ElLoading } from 'element-plus';
import type { LoadingInstance } from 'element-plus/lib/components/loading/src/loading';

const DEFAULT_LOADING = true;

class IRequest {
  instance: AxiosInstance;
  interceptors?: IRequestInterceptors;
  showLoading?: boolean;
  loading?: LoadingInstance;

  constructor(config: IRequestConfig) {
    this.instance = axios.create(config);

    this.showLoading = config.showLoading || DEFAULT_LOADING;
    this.interceptors = config.interceptors;

    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch,
    );

    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch,
    );

    this.instance.interceptors.request.use(
      (config) => {
        if (this.showLoading) {
          this.loading = ElLoading.service({
            lock: true,
            text: '加载中...',
            background: 'rgba(0, 0, 0, 0.7)',
          });
        }
        return config;
      },
      (err) => {
        console.log(err);
        return err;
      },
    );

    this.instance.interceptors.response.use(
      (res) => {
        this.loading?.close();

        const data = res.data;

        if (data.returnCode.startsWith('2')) {
          return data;
        }
      },
      (err) => {
        this.loading?.close();
        return err;
      },
    );
  }

  request<T>(config: IRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }

      if (config.showLoading === false) {
        this.showLoading = config.showLoading;
      }

      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          this.showLoading = DEFAULT_LOADING;
          resolve(res);
        })
        .catch((err) => {
          this.showLoading = DEFAULT_LOADING;
          reject(err);
          return err;
        });
    });
  }

  get<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' });
  }

  post<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' });
  }

  delete<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' });
  }

  patch<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' });
  }
}

export default IRequest;
