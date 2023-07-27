import type { Options } from 'amqplib';
import envConfig from '@env';
import { RabbitMQ } from '~/rabbitmq';
import { getContextLogger } from '~/logger';


export class ClientRabbitMQ extends RabbitMQ {
  private readonly logger = getContextLogger('M1-ClientRabbitMQ'); // мне лень, оно не имеет смысла здесь.

  constructor() {
    super(envConfig.rabbitmqConnectionAddress, envConfig.queueName);
  }

  protected override afterInitialization() {}

  public async sendUnidirectionalMessage(message: string, options?: Options.Publish) {
    const channel = await this.getReadyChannel();
    return channel.sendToQueue(this.queue, Buffer.from(message), options);
  }

  public async sendBidirectionalMessage(message: string, options?: Options.Publish) {
    const channel = await this.getReadyChannel();

    const responsePromise = new Promise<string>((resolve) => {
      const consumer = channel.consume(this.replyQueue, async (msg) => {
        if (!msg) return; // Тут этого не будет!

        resolve(msg.content.toString());
        channel.ack(msg);

        channel.cancel((await consumer).consumerTag);
      });
    });

    this.sendUnidirectionalMessage(message, { ...options, replyTo: this.replyQueue });

    return responsePromise;
  }
}
