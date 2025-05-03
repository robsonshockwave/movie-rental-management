export const httpResponse = <T = null>(statusCode: number, body: T) => {
  return { statusCode, body };
};
