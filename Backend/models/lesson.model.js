const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  description: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Lesson", LessonSchema);