import 'dotenv/config';
import Queue, { Job } from 'bull';
import { nodemailerService } from '../mail/nodemailer';
import { IMailData } from '../../domain/services/IMailService';

// Validação de tipos de env
const redisHost = process.env.REDIS_HOST;
const redisPort = Number(process.env.REDIS_PORT);

if (!redisHost || isNaN(redisPort)) {
  throw new Error(
    'REDIS_HOST ou REDIS_PORT não estão definidos corretamente no .env'
  );
}

// Configuração da fila
export const mailConfigForQueue = {
  key: 'SendMail',
  handle: async (job: Job<IMailData>) => {
    const { data } = job;

    try {
      await nodemailerService().sendMail(data);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error; // importante para o Bull entender que falhou
    }
  },
};

// Criação da fila com tipos
export const sendMailQueue = new Queue<IMailData>(mailConfigForQueue.key, {
  redis: { host: redisHost, port: redisPort },
});

// Inicializa o processador da fila
sendMailQueue.process(mailConfigForQueue.handle);

// Listener para falhas
sendMailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} falhou:`, err);
});
