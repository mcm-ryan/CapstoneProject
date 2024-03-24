const express = require('express');
const kafkaService = require('./kafka/kafkaService');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const gameRouter = require('./routes/gameRouter');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/game', gameRouter);

// Start the Express server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Kafka setup
(async () => {
    try {
        // Connect to Kafka
        await kafkaService.connectKafka();
        console.log('Kafka connected successfully');
        console.log('Kafka consumer running');
        //await kafkaService.createTopic('test2');
        //await kafkaService.produceMessage('test', 'key1', 'Hello, this is the a demo message')
        await kafkaService.consumeMessages('test2');

        // Create Kafka topics
        const topicName = 'demo-topic';
        //await kafkaService.deleteTopic();

        // Start sending or consuming messages here if needed

    } catch (error) {
        console.error('Error starting the Kafka service:', error);
        // Properly handle Kafka connection errors
        // Depending on your policy, you might want to retry or handle this differently
        process.exit(1);
    }
})();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await kafkaService.disconnectKafka();
    console.log('Kafka disconnected');
    server.close(() => {
        console.log('Server stopped');
        process.exit(0);
    });
});

module.exports = app;
