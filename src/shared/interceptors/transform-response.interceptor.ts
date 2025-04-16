import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable, map } from 'rxjs';

import { TransformResponse } from '@shared/util/response.transform';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, TransformResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<TransformResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof TransformResponse) {
          return data;
        } else {
          return TransformResponse.ok(data);
        }
      }),
    );
  }
}
