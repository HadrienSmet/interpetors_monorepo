import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    RequestTimeoutException,
} from "@nestjs/common";
import { Observable, TimeoutError } from "rxjs";
import { catchError, timeout } from "rxjs/operators";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            timeout(120_000), // 2 minutes
            catchError(err => {
                if (err instanceof TimeoutError) {
                    throw new RequestTimeoutException("Request timed out");
                }
                throw err;
            }),
        );
    }
}
