import { Logger } from "../logging/Logger";

export interface KafkaMessage {
  key?: string;
  value: string;
  headers?: Record<string, string>;
}

export class KafkaClient {
  constructor(private readonly logger: Logger) {}

  async publish(topic: string, message: KafkaMessage): Promise<void> {
    this.logger.info(`Kafka publish topic=${topic} key=${message.key ?? ""}`);
  }

  async consume(topic: string, maxMessages = 1): Promise<KafkaMessage[]> {
    this.logger.info(`Kafka consume topic=${topic} maxMessages=${maxMessages}`);
    return [];
  }
}
