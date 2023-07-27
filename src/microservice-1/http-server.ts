import { createServer } from "http";
import { ClientRabbitMQ } from "./client-rabbitmq";
import { getContextLogger } from "~/logger";

const clientRabbitMQ = new ClientRabbitMQ();

export const server = createServer();

const logger = getContextLogger('M1-HttpServer');

server.on('request', async (req, res) => {
  const url = new URL(`http://${req.headers.host ?? 'localhost'}${req.url ?? '/'}`);
  const name = url.searchParams.get('name') || 'defaultName';

  logger.debug(`New request with name "${name}"`);
  const response = await clientRabbitMQ.sendBidirectionalMessage(name);

  res.write(response);
  res.end();

  logger.debug(`Response is sent to client with name "${name}"`);
});

server.on('listening', () => {
  logger.log('Http server is started successfully');
});