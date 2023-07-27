import { Channel, Connection, Options, connect } from 'amqplib';

export abstract class RabbitMQ {
  protected readonly connectionPromise: Promise<Connection>;
  private readonly channelPromise: Promise<Channel>;
  protected initialize: Promise<void>;

  constructor(
    connectionOptions: string | Options.Connect,
    protected readonly queue: string,
    protected readonly replyQueue: string = `${queue}_reply`
  ) {
    this.connectionPromise = connect(connectionOptions);
    this.channelPromise = this.connectionPromise.then(connection =>
      connection.createChannel()
    );

    this.initializeQueue();
  }

  private async initializeQueue() {
    const assertQueue = (queue: string) => this.channelPromise.then(channel => channel.assertQueue(queue));

    this.initialize = Promise.all([
      assertQueue(this.queue),
      assertQueue(this.replyQueue),
    ]).then(undefined);

    this.initialize.then(this.afterInitialization.bind(this));
  }

  protected abstract afterInitialization(): any

  protected async getReadyChannel(): Promise<Channel> {
    await this.initialize;
    return await this.channelPromise;
  }

  public async destroy() {
    const channel = await this.channelPromise;
    const connection = await this.connectionPromise;

    await channel.deleteQueue(this.queue);
    await channel.deleteQueue(this.replyQueue);
    await channel.close();

    await connection.close();
  }
}
