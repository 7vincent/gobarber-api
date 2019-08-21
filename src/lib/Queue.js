import Bee from 'bee-queue';
import redisConfig from '../config/redis';
// Vamos importar todos os jobs que precisarmos aqui e inserir em um array logo abaixo.
import CancellationMail from '../app/jobs/CancellationMail';

const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {}; // cada sereviço vai ter sua fila
    this.init();
  }

  // inicializando nova fila
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // add novos itens a fila. Ex: queue = CancellationMail, job = apoointment
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // Processando a fila.
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFaulure).process(handle);
    });
  }

  handleFaulure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED `, err);
  }
}

export default new Queue();
