import { HttpExceptionBodyMessage } from '@nestjs/common';

interface ResponseBase<T> {
  message: T;
  statusCode: number;
}

// Success → message sempre string
export interface ResponseSuccess<T = unknown> extends ResponseBase<string> {
  data?: T; // può essere opzionale perché non tutti gli endpoint sono obbligati a ritornare dati
}

// Error → message può essere string | string[] | number
export type ResponseError = ResponseBase<HttpExceptionBodyMessage>;
