export interface ApplicationErrorLog {
  id: number;
  createdUtc: string;
  message: string;
  logLevel: string;
  category: string;
  exceptionType: string;
  exceptionMessage: string;
  stackTrace: string;
  innerException: string;
  userId: string;
  userName: string;
  traceId: string;
  requestPath: string;
  httpMethod: string;
}
