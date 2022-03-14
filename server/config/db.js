const mongoose = require('mongoose');


const connectDB = async() => {

    try {
        
        await mongoose.connect( process.env.MONGO_URL , {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        });

        console.log('DB Online');


    } catch (error) {
        console.log(error);
        throw new Error('Erro ao inicializar  o BD');
    }


}


module.exports = {
    connectDB
}