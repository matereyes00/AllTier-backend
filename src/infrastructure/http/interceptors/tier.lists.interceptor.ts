import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class TierListInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext, next: CallHandler<any>
    ): Observable<any> | Promise<Observable<any>> {
        const now = Date.now();
        console.log(`Incoming request: ${context.getClass().name}.${context.getHandler().name}`);  
        console.log(`Execution time: ${Date.now() - now}ms`);
        return next.handle().pipe(
            map((data) => {
                if (data && data.data !== undefined) {
                    return data;
                }
                return {data}
                // success: true,
                // timestamp: new Date().toISOString(),
                // path: context.switchToHttp().getRequest().url,
            })
        );
    }
    
}


