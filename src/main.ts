import envConfig from "@env";
import { server } from "./microservice-1/http-server";
import { ServerRabbitMQ } from "./microservice-2/server-rabbitmq";

void async function() {
  // Start listening tasks | Microservice-2
  new ServerRabbitMQ();


  // Start HTTP-server | Microservice-1
  server.listen(envConfig.httpPort);
}();
