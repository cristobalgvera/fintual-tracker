import { Logger, Type } from '@nestjs/common';

export type HandleErrorOptions<E extends Error> = {
  /** The error to handle */
  error: E;

  /** The class from where `handleError` is called  */
  caller: Type;

  /** The method of the class from where `handleError` is called */
  methodName: string;
};

type HandleErrorOptionsSchema<E extends Error> = Pick<
  HandleErrorOptions<E>,
  'error'
> &
  Partial<Omit<HandleErrorOptions<E>, 'error'>>;

export abstract class ErrorService<
  Err extends Error = Error,
  Resp = void,
  Opts extends HandleErrorOptionsSchema<Err> = HandleErrorOptions<Err>,
> {
  private readonly _logger = new Logger(ErrorService.name);

  /**
   * This method must return, if required, the exception to be handled
   * by the NestJS exception filter.
   */
  protected abstract throwException(error: Err): Resp;

  /**
   * This method must validate the error to be handled, e.g., in case
   * that only one type of error must be handled and you need to validate
   * it in runtime.
   */
  protected validateError?(error: Err): Resp | undefined;

  /**
   * This method is responsible for handling errors that are thrown by any
   * required context.
   *
   * It will log the error and then throw an exception based on the actual
   * error.
   *
   * ---
   *
   * Usage example:
   *
   * try {
   *   // Implementation...
   * } catch (error) {
   *   this.errorService.handleError({
   *     error,
   *     caller: MyCallerClass,
   *     methodName: this.myCallerMethod.name,
   *   }),
   * }
   */
  handleError(options: Opts): Resp {
    const erroneousValidation = this.validateError?.(options.error);

    if (erroneousValidation) return erroneousValidation;

    this.logError(options);

    return this.throwException(options.error);
  }

  /**
   * This method must log the error in any required context.
   */
  protected logError(options: Opts): void {
    const { caller, methodName, error } = options;

    const methodContext = methodName ? `${methodName}: ` : '';

    this._logger.error(
      `${methodContext}${error.message}`,
      error.stack,
      caller?.name ?? ErrorService.name,
    );
  }
}
