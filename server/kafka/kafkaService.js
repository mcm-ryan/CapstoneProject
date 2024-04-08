const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'tictalktoe',
    brokers: ['192.168.49.2:30005'],
    sasl: {
        mechanism: 'plain', // Change this according to your Kafka cluster's configuration
        username: 'user1', // Use your SASL username
        password: 'OEJat39I5p' // Use your SASL password
    },
});

// Producer instance
const producer = kafka.producer();
// Consumer instance
const consumer = kafka.consumer({ groupId: 'tictactoe-game-group' });
// Admin instance for managing topics
const admin = kafka.admin();
//console.log(admin.listTopics())




// Connect the producer and consumer
const connectKafka = async () => {
    await producer.connect();
    await consumer.connect();
}

async function deleteTopic() {
    await admin.deleteTopics({
        topics: ["test-topic"]
    })
}

async function createTopic(topicName) {
    try {
        await admin.connect();

        await admin.createTopics({
            topics: [{
                topic: topicName,
                numPartitions: 3,
                replicationFactor: 1
            }]
        });

        admin.listTopics();

        console.log('Topic created successfully');
    } catch (error) {
        console.error('Error creating topic:', error);
    } finally {
        await admin.disconnect();
    }
}

// Function to produce a message to a topic
const produceMessage = async (topic, keyInput, valueInput) => {
    await producer.send({
        topic,
        messages: [
            { key: keyInput, value : valueInput},
        ],
    });

    //console.log('Message produced successfully:', messages);
}


// Function to consume messages from a topic
const consumeMessages = async (topic) => {
    await consumer.subscribe({ topic, fromBeginning: true } );

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            console.log({
              value: message.value.toString(),
            });
          } catch (error) {
            console.error('Error processing message:', error);
          }
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
    disconnectKafka, 
    deleteTopic
}
