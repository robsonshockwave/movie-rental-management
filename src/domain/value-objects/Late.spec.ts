import { AppError } from '../../shared/utils/AppError';
import { Late } from './Late';

describe('Late', () => {
  test('should be able to create a late', () => {
    const late = new Late({
      delivery_date: '2025-01-01',
      return_date: '2025-01-02',
    });

    expect(late).toBeInstanceOf(Late);
  });

  test('should not be able to create a late with invalid dates', () => {
    expect(() => {
      new Late({
        delivery_date: 'aaaaaa',
        return_date: 'bbbbb',
      });
    }).toThrow(AppError.invalidDates);
  });

  test('should return days late', () => {
    const late = new Late({
      delivery_date: '2025-01-01',
      return_date: '2025-01-02',
    });

    expect(late.daysLate()).toBe(1);
  });

  test('should calculate fine', () => {
    const late = new Late({
      delivery_date: '2025-01-01',
      return_date: '2025-01-02',
    });

    expect(late.calculateFine()).toBe(5);
  });

  test('should return fine message', () => {
    const late = new Late({
      delivery_date: '2025-01-01',
      return_date: '2025-01-02',
    });

    expect(late.fineMessage()).toBe('Multa por atraso: R$ 5,00');
  });

  test('should return fine message with zero value', () => {
    const late = new Late({
      delivery_date: '2025-01-01',
      return_date: '2025-01-01',
    });

    expect(late.fineMessage()).toBe('Multa por atraso: R$ 0,00');
  });
});
