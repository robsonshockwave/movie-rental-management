import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IMailData } from '../../../domain/services/IMailService';

export const nodemailerService = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    pot: process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  } as SMTPTransport.Options);

  const sendMail = async ({
    requested_date,
    delivery_date,
    client_name,
    cpf,
    email,
    movie_name,
  }: IMailData) => {
    const requested_date_BR = new Date(requested_date).toLocaleString('pt-BR', {
      timeZone: 'UTC',
    });
    const delivery_date_BR = new Date(delivery_date).toLocaleString('pt-BR', {
      timeZone: 'UTC',
    });

    await transporter.sendMail({
      from: 'Locadora de filmes',
      to: email,
      subject: 'Novo filme alugado',
      html: `
          <h1>Novo filme alugado</h1>
          <p>Nome do filme: ${movie_name}</p>
          <p>Nome do cliente: ${client_name}</p>
          <p>CPF do cliente: ${cpf}</p>
          <p>Data de retirada: ${requested_date_BR}</p>
          <p>Data para entrega: ${delivery_date_BR}</p>
        `,
    });
  };

  return { sendMail };
};
