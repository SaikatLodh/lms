const cron = require("node-cron");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const sendEmail = require("../helpers/sendEmail");

const automation = () => {
  cron.schedule("* * * * *", async () => {
    const courses = await Course.find({
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    courses.forEach(async (course) => {
      const getStudents = course.students;

      getStudents.forEach(async (student) => {
        const user = await User.findById(student);

      });
    });
  });
};

export default automation;
