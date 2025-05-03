import { AppError } from '../../../shared/errors/AppError';
import { Either } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { GetPendingHiresController } from './GetPendingHiresController';

describe('GetPendingHiresController', () => {
  const getPendingHiresUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return an httpResponse 200 and a list of hires if the search is successful', async () => {
    getPendingHiresUseCase.execute.mockResolvedValue(Either.right([]));

    const sut = new GetPendingHiresController(getPendingHiresUseCase);

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(200, []));
    expect(getPendingHiresUseCase.execute).toHaveBeenCalledTimes(1);
  });

  test('should return a throw AppError if getPendingHiresUseCase is not provided', async () => {
    const sut = new GetPendingHiresController(undefined as any);

    await expect(sut.handle()).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });
});
