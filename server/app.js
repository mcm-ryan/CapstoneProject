
const express = require('express');
const kafkaService = require('./kafka/kafkaService');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const gameRouter = require('./routes/gameRouter')
const app = express();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const port = 3001
const cors = require('cors')
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/game', gameRouter);

const topicName = 'demo-topic';
const demoMessage = 'Hello from KafkaJS!';

// Kafka setup
async function startServer() {
    try {
        // Connect to Kafka and start processing messages
        await kafkaService.connectKafka();
        console.log('Kafka connected successfully');
        console.log('Kafka consumer running');
        //await kafkaService.createTopic(topicName);
        //await kafkaService.sendDemoMessage(topicName, demoMessage);

        // // Start the Express server
        // app.listen(port, () => {
        //     console.log(`Server is running on port ${port}`);
        // });

    } catch (error) {
        console.error('Error starting the Kafka service:', error);
        // Properly handle Kafka connection errors
        // Depending on your policy you might want to crash the app or handle this differently
        process.exit(1);
    }
}
// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await kafkaService.disconnectKafka();
    console.log('Kafka disconnected');
    process.exit(0);
});

module.exports = app;