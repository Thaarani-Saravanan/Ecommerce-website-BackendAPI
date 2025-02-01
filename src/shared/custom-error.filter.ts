import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class CustomErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = ['Internal server error'];
    let data: string | object | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = [exception.message];
      data = exception.getResponse();
    } else if (exception instanceof Error) {
      message = [exception.message];
    }

    response.status(status).json({ status: false, data, message });
  }
}
