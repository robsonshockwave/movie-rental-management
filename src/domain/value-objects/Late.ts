import { AppError } from '../../shared/utils/AppError';

interface LateProps {
  delivery_date: string;
  return_date: string;
}

export class Late {
  private readonly delivery_date: Date;
  private readonly return_date: Date;

  constructor({ delivery_date, return_date }: LateProps) {
    if (!delivery_date || !return_date) {
      throw new AppError(AppError.missingMandatoryParameters);
    }

    this.delivery_date = new Date(delivery_date);
    this.return_date = new Date(return_date);

    if (
      isNaN(this.delivery_date.getTime()) ||
      isNaN(this.return_date.getTime())
    ) {
      throw new AppError(AppError.invalidDates);
    }
  }

  public daysLate() {
    const diff = this.return_date.getTime() - this.delivery_date.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return days > 0 ? days : 0;
  }

  public calculateFine() {
    const fineValue = this.daysLate() * 5;

    return fineValue > 0 ? fineValue : 0;
  }

  public fineMessage() {
    const value = this.calculateFine();

    return `Multa por atraso: R$ ${value.toFixed(2).replace('.', ',')}`;
  }
}
