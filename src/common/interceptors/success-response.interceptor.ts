import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';
import { ResponseSuccess } from '../interfaces';

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseSuccess<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseSuccess<T>> {
    const statusCode = context
      .switchToHttp()
      .getResponse<Response>().statusCode;

    return next.handle().pipe(
      map((data?: T): ResponseSuccess<T> => {
        const responseSuccessBody: ResponseSuccess<T> = {
          message: 'Success',
          statusCode: statusCode,
          data: data,
        };
        return responseSuccessBody;
      }),
    );
  }
}
