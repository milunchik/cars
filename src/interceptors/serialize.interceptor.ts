import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    console.log('Intercepting request...', context);

    return handler.handle().pipe(
      map((data: any) => {
        console.log('Data before transformation:', data);
        if (data) {
          return plainToClass(this.dto, data, {
            excludeExtraneousValues: true,
          });
        }
        return data;
      }),
    );
  }
}
