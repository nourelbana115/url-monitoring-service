const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb://0.0.0.0:27017/bosta',
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            }
        );
        console.log('Mongo DB connected ...');
    } catch (error) {
        process.exit(1);
    }
};

module.exports = { connectDB };
