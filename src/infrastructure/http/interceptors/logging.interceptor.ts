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
    const { method, url } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;
    
    // Log the initial request without the body. For multipart/form-data,
    // the body is not yet parsed at this stage of the request lifecycle.
    this.logger.log(`[Request] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);

    const now = Date.now();

    return next
      .handle()
      .pipe(
        // The 'tap' operator handles successful responses
        tap((responseBody) => {
          const duration = Date.now() - now;
          const { statusCode } = context.switchToHttp().getResponse();
          const { body } = request; // Get the body now, AFTER it has been parsed by other interceptors.
          
          const responseLog = `[SUCCESS Response] ${statusCode} ${method} ${url} - Duration: ${duration}ms`;

          // Log the request body that led to this successful response
          if (body && Object.keys(body).length > 0) {
            this.logger.log(`--> Request Body: ${JSON.stringify(body)}`);
          }
          
          this.logger.log(responseLog);
          this.logger.log(`--> Response Body: ${JSON.stringify(responseBody)}`);
        }),
        // The 'catchError' operator handles errors
        catchError((error) => {
          const duration = Date.now() - now;
          const { body } = request; // Get the body now
          const statusCode = error.getStatus ? error.getStatus() : 500;
          
          const errorLog = `[ERROR Response] ${statusCode} ${method} ${url} - Duration: ${duration}ms`;

          // Log the request body that caused the error
          if (body && Object.keys(body).length > 0) {
            this.logger.error(`--> Failed Request Body: ${JSON.stringify(body)}`);
          }

          // Log the error's stack trace for detailed debugging
          this.logger.error(errorLog, error.stack);

          // Re-throw the error to ensure the client receives the proper HTTP error response
          return throwError(() => error);
        }),
      );
  }
}

