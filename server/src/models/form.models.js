import mongoose from "mongoose";
import User from "./user.models.js";


const questionSchema = new mongoose.Schema({
  id : {
    type : String,
    required : true
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: false,
  },
  answer: {
    type: String,
    required: false, 
  },
}, { _id: false }); 


const formSchema = new mongoose.Schema({
  formType: {
    type: String,
    required: true,
    enum: ['survey', 'quiz'],
  },
  title : {
    type : String,
    default : "Untitled Form"
  },
  description : {
    type : String,
    default : "No description provided"
  },
  time : {
    type : String,
    required : false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: [questionSchema],
} , {timestamps : true});


formSchema.pre('save', function(next) {
  if (this.formType === 'quiz') {
    this.questions.forEach(question => {
      if (!question.answer) {
        const err = new Error(`Answer is required for question: ${question.title}`);
        return next(err);
      }
    });
  }
  next();
});


const Form = mongoose.model('Form', formSchema);

export default Form
