const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'tictactoe-game',
    brokers: ['192.168.49.2:31000'],
    sasl: {
        mechanism: 'plain', // Change this according to your Kafka cluster's configuration
        username: 'user1', // Use your SASL username
        password: 'n2Vk3YksWN' // Use your SASL password
    },
});

// Producer instance
const producer = kafka.producer();
// Consumer instance
const consumer = kafka.consumer({ groupId: 'tictactoe-game-group' });
// Admin instance for managing topics
const admin = kafka.admin();




// Connect the producer and consumer
const connectKafka = async () => {
    await producer.connect();
    await consumer.connect();
}



async function createTopic() {
    try {
        await admin.connect();

        await admin.createTopics({
            topics: [{
                topic: 'test-topic',
                numPartitions: 3,
                replicationFactor: 1
            }]
        });

        console.log('Topic created successfully');
    } catch (error) {
        console.error('Error creating topic:', error);
    } finally {
        await admin.disconnect();
    }
}

// Function to produce a message to a topic
const produceMessage = async (topic, key, value) => {
    await producer.send({
        topic,
        messages: [
            { key, value },
        ],
    });
}


// Function to consume messages from a topic
const consumeMessages = async (topic) => {
    await consumer.subscribe({ topic });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                topic,
                partition,
                offset: message.offset,
                key: message.key.toString(),
                value: message.value.toString(),
            });
        },
    });
}

// Function to disconnect Kafka clients
const disconnectKafka = async () => {
    console.log('Disconnecting Kafka client...');

    // Consumer should be stopped before the producer to ensure all messages are processed.
    if (consumer) {
        console.log('Disconnecting Kafka consumer...');
        await consumer.disconnect();
    }

    if (producer) {
        console.log('Disconnecting Kafka producer...');
        await producer.disconnect();
    }

    console.log('Kafka client disconnected successfully');
}

module.exports = {
    connectKafka,
    produceMessage,
    consumeMessages,
    createTopic,
    disconnectKafka
};
