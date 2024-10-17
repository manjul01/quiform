import mongoose from "mongoose";
import Form from "../models/form.models.js";
import SubmittedForm from "../models/submittedForm.models.js";

const generateForm = async (req, res) => {
  const { formType, title, time, description, creator, questions } = req.body;

  if (!formType || !["survey", "quiz"].includes(formType)) {
    return res.status(400).json({ message: "Invalid form type" });
  }
  if (!creator) {
    return res.status(400).json({ message: "Creator is required" });
  }
  if (!questions || questions.length === 0) {
    return res.status(400).json({ message: "Questions are required" });
  }

  if (formType === "quiz") {
    for (let question of questions) {
      if (!question.answer) {
        return res.status(400).json({
          message: `Answer is required for question: ${question.title}`,
        });
      }
    }
  }
  try {
    const newForm = new Form({
      formType,
      title: title || "Untitled Form",
      time,
      description: description || "No description provided",
      creator,
      questions,
    });
    const savedForm = await newForm.save();
    res.status(200).json({ formId: savedForm._id });
  } catch (error) {
    console.log("error creating form:", error);
    res
      .status(500)
      .json({ message: "Failed to create form", message: message.message });
  }
};

//agar form request krne wala admin hai to answer bhi bhj do nahi to bina answer k bhj do
const getForm = async (req, res) => {
  const { formId } = req.query;
  const requestingUser = req.user;

  if (!formId) {
    return res.status(400).json({ message: "formId is required" });
  }

  try {
    const formFetched = await Form.findById(formId).lean();

    if (!formFetched) {
      return res.status(404).json({ message: "Form not found" });
    }

    const form = { ...formFetched };

    if (form.creator.toString() === requestingUser.id) {
      // console.log("form with answers ---------------", form);
      res.status(200).json({ form });
    } else {
      const formWithoutAnswers = {
        ...form,
        questions: form.questions.map(({ answer, ...rest }) => rest),
      };
      const {
        creator: creator,
        ...nonCreatorForm
      } = formWithoutAnswers;
      // console.log(nonCreatorForm);
      res.status(200).json({ form: nonCreatorForm });
    }
  } catch (error) {
    console.error("Error fetching form", error);
    res.status(500).json({ message: "Server error" });
  }
};

const submitForm = async (req, res) => {
  try {
    const { userId, formId, responses } = req.body;
    // if(!userId) console.log("userId not found")
    const newSubmittedForm = new SubmittedForm({
      userId,
      formId,
      responses,
    });
    await newSubmittedForm.save();
    return res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error submitting form", error });
  }
};

//jitne bhi submissions hai ek form pe wo de rha hai ye
const getSubmittedFormData = async (req, res) => {
  try {
    const { formId } = req.query;
    const requestingUser = req.user;
    if (!formId) {
      return res.status(400).json({ message: "Form ID is required." });
    }

    const formFetched = await Form.findById(formId).lean();
    if (!formFetched) {
      return res.status(404).json({ message: "Form not found." });
    }

    const ObjectId = mongoose.Types.ObjectId;
    const userIdObject = new ObjectId(requestingUser.id);

    if (!userIdObject.equals(formFetched.creator)) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const submittedForms = await SubmittedForm.find({ formId });

    if (!submittedForms || submittedForms.length === 0) {
      return res.status(204).json({ message: "No submissions yet" });
    }

    return res.status(200).json(submittedForms);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error retrieving submitted forms", error });
  }
};

const getSubmission = async (req, res) => {
  const { userId, formId } = req.body;
  try {
    const submission = await SubmittedForm.findOne({ userId, formId });
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    res.json({ submission });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getUserForms = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(404).json({ message: "userId is required" });
  }

 try {
   const ObjectId = mongoose.Types.ObjectId;
   const userIdObject = new ObjectId(userId);
 
   const formsCreatedByUser = await Form.find({ creator: userIdObject });
 
   if (!formsCreatedByUser) {
     return res.status(404).json({ message: "user has not created any form" });
   }
   res.status(200).json({
     forms: formsCreatedByUser,
   });
 } catch (error) {
  console.log(error)
 }
};

export {
  generateForm,
  getForm,
  submitForm,
  getSubmittedFormData,
  getSubmission,
  getUserForms
};
