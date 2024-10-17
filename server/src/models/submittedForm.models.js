import mongoose from "mongoose";

const submittedQuestionSchema = new mongoose.Schema({
  questionId: {
    type: String, 
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
}, { _id: false }); 

const submittedFormSchema = new mongoose.Schema({
    userId : {
    type: String,
    required: true,
    },
  formId: {
    type: String,
    required: true,
  },
  responses: [submittedQuestionSchema],
} , {timestamps : true});

const SubmittedForm = mongoose.model('SubmittedForm', submittedFormSchema);

export default SubmittedForm
