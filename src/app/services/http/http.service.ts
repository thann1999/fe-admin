import axios, { AxiosRequestHeaders, Method } from 'axios';
import { ACCESS_TOKEN } from 'shared/const/user-info.const';
import StorageService from '../storage';
import { HttpMethod, HttpOptions } from './http.type';

export class HttpService {
  private commonHeader = {
    Accept: 'application/json',
    'Cache-Control': 'no-cache no-store',
    Pragma: 'no-cache',
    Expires: 0,
    'Access-Control-Allow-Origin': '*',
  };

  public get<T>(uri: string, options?: HttpOptions): Promise<T | undefined> {
    return this.request(uri, HttpMethod.GET, options);
  }

  public post<T>(uri: string, options?: HttpOptions): Promise<T | undefined> {
    return this.request(uri, HttpMethod.POST, options);
  }

  public put<T>(uri: string, options?: HttpOptions): Promise<T | undefined> {
    return this.request(uri, HttpMethod.PUT, options);
  }

  public delete<T>(uri: string, options?: HttpOptions): Promise<T | undefined> {
    return this.request(uri, HttpMethod.DELETE, options);
  }

  public async request<T>(
    uri: string,
    method: Method,
    options?: HttpOptions
  ): Promise<T | undefined> {
    const url = this.resolve(uri);

    try {
      const response = await axios.request({
        url,
        method,
        data: options?.body,
        params: options?.queryParams,
        headers: this.generateHeader(options?.headers),
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      } else {
        throw new Error('Error');
      }
    }
  }

  private generateHeader = (
    header?: AxiosRequestHeaders
  ): AxiosRequestHeaders => {
    const token = StorageService.get(ACCESS_TOKEN);

    return {
      ...this.commonHeader,
      ...header,
      token: token || '',
    };
  };

  // eslint-disable-next-line class-methods-use-this
  private resolve = (uri: string): string => {
    if (/^(http|https):\/\/.+$/.test(uri)) {
      return uri;
    }
    return `${process.env.REACT_APP_BASE_API_URL}${uri}`;
  };
}

export default new HttpService();
