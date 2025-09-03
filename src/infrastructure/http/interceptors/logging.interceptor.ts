import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;
    
    let requestLog = `[Request] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`;
    if (body && Object.keys(body).length > 0) {
      requestLog += ` - Body: ${JSON.stringify(body)}`;
    }
    
    this.logger.log(requestLog);

    const now = Date.now();

    return next
      .handle()
      .pipe(
        // The 'tap' operator handles successful responses
        tap((responseBody) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - now;
          
          const responseLog = `[SUCCESS Response] ${statusCode} ${method} ${url} - Duration: ${duration}ms - Body: ${JSON.stringify(responseBody)}`;
          
          this.logger.log(responseLog);
        }),
        // --- ADDITION: The 'catchError' operator handles errors ---
        catchError((error) => {
          const duration = Date.now() - now;
          // Determine the status code from the error, defaulting to 500
          const statusCode = error.getStatus ? error.getStatus() : 500;
          
          // Use the logger's 'error' method for exceptions
          this.logger.error(
            `[ERROR Response] ${statusCode} ${method} ${url} - Duration: ${duration}ms`,
            // Log the error's stack trace for detailed debugging
            error.stack,
          );

          // Re-throw the error to ensure the client receives the proper HTTP error response
          return throwError(() => error);
        }),
      );
  }
}

