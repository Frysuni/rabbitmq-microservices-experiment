import { config } from "dotenv";
import { from } from 'env-var';

config();
const env = from(process.env);

export const envConfig = {
  rabbitmqConnectionAddress: env.get('RABBITMQ_CONNECTION_ADDRESS').required().asUrlString(),
  queueName: env.get('QUEUE_NAME').default('tasks').asString(),
  httpPort: env.get('HTTP_PORT').required().asPortNumber(),
};
export default envConfig;