console.log("Consumer...");
import Kafka from 'node-rdkafka';

const consumer = Kafka.KafkaConsumer({
    'group.id': 'Kafka',
    "metadata.broker.list": "localhost:9092"
},{});

consumer.connect()

consumer.on('ready', () => {
    console.log("Consumer ready..");
    consumer.subscribe(['test']);
    consumer.consume();
}).on('data', (data) => {
    console.log(`recieved message: ${data.value}`)
});