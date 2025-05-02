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

  static valueAlreadyRegistered(value: string) {
    return { message: `${value} já cadastrado.` };
  }
}
