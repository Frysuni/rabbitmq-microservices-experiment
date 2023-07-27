import envConfig from '@env';
import { getContextLogger } from '~/logger';
import { RabbitMQ } from '~/rabbitmq';

export class ServerRabbitMQ extends RabbitMQ {
  private readonly logger = getContextLogger('M2-ServerRabbitMQ');

  constructor() {
    super(envConfig.rabbitmqConnectionAddress, envConfig.queueName);
  }

  protected override afterInitialization() {
    this.startListening();
  }

  private async startListening() {
    const channel = await this.getReadyChannel();
    channel.consume(this.queue, async msg => {
      if (!msg) return;

      const content = msg.content.toString();
      const replyTo = msg.properties.replyTo;

      const response = await this.processMessage(content);

      if (replyTo) channel.sendToQueue(replyTo, Buffer.from(response));

      channel.ack(msg);
    });
  }

  private readonly namesCache = new Map<string, number>();
  private async processMessage(message: string): Promise<string> {
    this.logger.log(`Processing message with data: "${message}"`);

    const name = message;

    const countOfOperations = this.namesCache.get(name) ?? 0;
    this.namesCache.set(name, countOfOperations + 1);

    return `Hello, ${name}, you've been here ${countOfOperations} times already`;
  }
}
