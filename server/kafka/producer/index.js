console.log("Producer...")
import Kafka from 'node-rdkafka';

const stream = Kafka.Producer.createWriteStream(
    { "metadata.broker.list": '192.168.49.2:31000' },
    {},
    { topic: 'test' });


function queueMessage() {
    const success = stream.write(Buffer.from('hi'));
    if (success) {
        console.log("Message sent successfully");
    } else {
        console.log("Message failed to send")
    }
}

// Interval to queu messages 
setInterval(() => {
    queueMessage();
}, 3000)
