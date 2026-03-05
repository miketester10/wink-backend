import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpExceptionBody,
  HttpExceptionBodyMessage,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseError } from '../interfaces';

@Catch()
export class ErrorResponseFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorResponseFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // messaggio di default per tutti gli errori
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: HttpExceptionBodyMessage = 'Internal server error';

    // messaggio personalizzato per gli errori HTTP
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const responseException: string | object = exception.getResponse();
      message =
        typeof responseException === 'string'
          ? responseException
          : (responseException as HttpExceptionBody).message;
      this.logger.error(`HTTP Error: ${message.toString()}`);
    } else if (exception instanceof Error) {
      this.logger.error(`Error: ${exception.message}`);
    } else {
      this.logger.error(`Unknow error: ${JSON.stringify(exception)}`);
    }

    const responseErrorBody: ResponseError = {
      message,
      statusCode,
    };

    response.status(statusCode).json(responseErrorBody);
  }
}
