export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }

  static dependencies = 'Alguma dependência obrigatória não foi fornecida';
  static missingMandatoryParameters =
    'Algum parametro obrigatório não foi fornecido';
}
