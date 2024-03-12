const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'tictactoe-game',
    brokers: ['localhost:9092'],
    sasl: {
        mechanism: 'plain', // Change this according to your Kafka cluster's configuration
        username: 'user1', // Use your SASL username
        password: 'JaqupVdCMB' // Use your SASL password
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


const createTopic = async (topicName) => {
    await admin.connect();
    //await admin.listTopics();

    // const topicsToCreate = [{
    //     topic: topicName,
    //     numPartitions: 1, // Customize based on your needs
    //     replicationFactor: 1 // Customize based on your cluster setup
    // }];
    // await admin.createTopics({
    //     waitForLeaders: true,
    //     topics: topicsToCreate,
    // });
    // console.log(`Topic ${topicName} created successfully.`);
    await admin.disconnect();
};


const sendDemoMessage = async () => {
    await producer.send({
        topic: 'example',
        messages: [
            { key: 'key1', value: 'hello world' },
            { key: 'key2', value: 'hey hey!' }
        ],
    })
}



    // // Function to process incoming messages (example for game moves)
    // const processMessages = async () => {
    //     await consumer.subscribe({ topic: 'game-moves', fromBeginning: true });

    //     await consumer.run({
    //         eachMessage: async ({ topic, partition, message }) => {
    //             const gameId = message.key.toString();
    //             const move = JSON.parse(message.value.toString());
    //             // Process the move, update game state, etc.
    //             // You may want to call a function from Game.js here
    //         },
    //     });
    // }

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
        createTopic,
        sendDemoMessage,
        disconnectKafka
    };
