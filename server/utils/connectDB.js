import mongoose from 'mongoose'

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://kaushikb882:kaushik$2006@cluster0.e7rwkmu.mongodb.net/TMdb')
    .then (() => console.log('Connected to MongoDB'));
} 
export default connectDB;