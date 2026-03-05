import { HttpExceptionBodyMessage } from '@nestjs/common';

interface ResponseBase<T = string> {
  message: T;
  statusCode: number;
}

// Success → message sempre string
export interface ResponseSuccess<T = unknown> extends ResponseBase<string> {
  data?: T; // può essere undefined perché non tutti gli endpoint ritornano dati
}

// Error → message può essere string | string[] | number
export type ResponseError = ResponseBase<HttpExceptionBodyMessage>;
