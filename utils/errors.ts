export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export const convertErrorToStatusCode = (error: Error) => {
  if (error instanceof NotFoundError) {
    return 404;
  }

  return 500;
};
