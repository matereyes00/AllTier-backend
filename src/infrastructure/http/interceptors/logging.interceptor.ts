import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request; // Get the body from the request
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;
    
    // Create the initial log message
    let requestLog = `[Request] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`;
    // --- ADDITION: Log the request body if it exists ---
    if (body && Object.keys(body).length > 0) {
      requestLog += ` - Body: ${JSON.stringify(body)}`;
    }
    
    this.logger.log(requestLog);

    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap((responseBody) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - now;
          
          const responseLog = `[Response] ${statusCode} ${method} ${url} - Duration: ${duration}ms - Body: ${JSON.stringify(responseBody)}`;
          
          this.logger.log(responseLog);
        }),
      );
  }
}