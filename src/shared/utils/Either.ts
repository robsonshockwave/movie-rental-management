export class Either<L, R> {
  private readonly leftValue: L | null;
  private readonly rightValue: R | null;

  private constructor(left: L | null, right: R | null) {
    this.leftValue = left;
    this.rightValue = right;
  }

  static left<T>(value: T) {
    return new Either(value, null);
  }

  static right<T>(value: T) {
    return new Either(null, value);
  }

  getLeft(): L | null {
    return this.leftValue;
  }

  getRight(): R | null {
    return this.rightValue;
  }

  fold(
    onLeft: (left: L | null) => {
      statusCode: number;
      body: L | null;
    },
    onRight: (right: R | null) => {
      statusCode: number;
      body: R | null;
    }
  ) {
    if (this.leftValue !== null) {
      return onLeft(this.leftValue);
    }

    return onRight(this.rightValue);
  }

  static valueAlreadyRegistered(value: string) {
    return { message: `${value} já cadastrado.` };
  }

  static dateForReturnLessThanRequestDate = {
    message: 'Data para retorno menor que data de solicitação',
  };

  static movieAlreadyHiredByClient = {
    message: 'Filme ja alugado pelo cliente',
  };
}

export type EitherType<T = null> = Either<
  Error | { message: string } | null,
  T
>;
