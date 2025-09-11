const Lecture = require("../../../models/lectureModel.js");
const Course = require("../../../models/courseModel.js");
const Notification = require("../../../models/notificationModel.js");
const {
  updateLectureValidation,
} = require("../../../helpers/validation/lecture/lectureValidator.js");
const { uploadVideos, deleteVideo } = require("../../../helpers/cloudinary.js");
const mongooseValidObjectId = require("mongoose").isValidObjectId;

class RenderAdminLecturePages {
  async renderLecturePage(req, res) {
    try {
      const { courseid } = req.params;

      if (!mongooseValidObjectId(courseid)) {
        req.flash("error", "Invalid course id");
        return res.redirect("/managelectures");
      }

      const findLectures = await Lecture.find({
        courseId: courseid,
        isDeleted: false,
      })
        .select("-__v")
        .lean()
        .exec();

      if (!findLectures) {
        req.flash("error", "Failed to get course");
        return res.redirect("/managelectures");
      }

      const notifications = await Notification.find({
        receiverId: req.user._id,
        messageType: "admin",
      })
        .populate({
          path: "senderId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        })
        .select("-__v")
        .sort({ createdAt: -1 });

      return res.render("manage-lectures", {
        title: "lectures",
        lectures: findLectures,
        notifications,
        user: req.user,
        error: req.flash("error"),
        success: req.flash("success"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/managelectures");
    }
  }

  async renderSingleLecture(req, res) {
    const { lectureid } = req.params;
    try {
      if (!mongooseValidObjectId(lectureid)) {
        req.flash("error", "Invalid lecture id");
        return res.redirect(`/managesinglelectures/${lectureid}`);
      }

      const findLecture = await Lecture.findById(lectureid)
        .select("-__v")
        .lean()
        .exec();

      if (!findLecture) {
        req.flash("error", "Failed to get course");
        return res.redirect(`/managesinglelectures/${lectureid}`);
      }

      const notifications = await Notification.find({
        receiverId: req.user._id,
        messageType: "admin",
      })
        .populate({
          path: "senderId",
          select: "fullName profilePicture gooleavatar faceBookavatar",
        })
        .select("-__v")
        .sort({ createdAt: -1 });

      return res.render("manage-single-lectures", {
        title: "lectures",
        lecture: findLecture,
        notifications,
        user: req.user,
        error: req.flash("error"),
        success: req.flash("success"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect(`/managesinglelectures/${lectureid}`);
    }
  }

  async updateLecture(req, res) {
    const { courseId, lectureId, title, description } = req.body;
    try {
      const file = req?.file?.path;

      if (
        !mongooseValidObjectId(lectureId) ||
        !mongooseValidObjectId(courseId)
      ) {
        req.flash("error", "Invalid ids");
        return res.redirect(`/managesinglelecture/${lectureId}`);
      }

      const { error } = updateLectureValidation(req.body);

      if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect(`/managesinglelecture/${lectureId}`);
      }

      const lecture = await Lecture.findOne({
        _id: lectureId,
        courseId,
      });

      if (!lecture) {
        req.flash("error", "Lecture not found");
        return res.redirect(`/managesinglelecture/${lectureId}`);
      }

      if (file) {
        const deletevideo = await deleteVideo(lecture.videos.public_id);

        if (!deletevideo) {
          req.flash("error", "Video delete failed");
          return res.redirect(`/managesinglelecture/${lectureId}`);
        }

        const result = await uploadVideos(file);

        if (!result) {
          req.flash("error", "Video upload failed");
          return res.redirect(`/managesinglelecture/${lectureId}`);
        }

        const updateLecture = await Lecture.findOneAndUpdate(
          { _id: lectureId },
          {
            title,
            description,
            videos: result,
          },
          { new: true }
        );

        if (!updateLecture) {
          req.flash("error", "Lecture update failed");
          return res.redirect(`/managesinglelecture/${lectureId}`);
        }

        req.flash("success", "Lecture updated successfully");
        return res.redirect(`/managesinglelecture/${lectureId}`);
      } else {
        const updateLecture = await Lecture.findOneAndUpdate(
          { _id: lectureId },
          {
            title,
            description,
          },
          { new: true }
        );

        if (!updateLecture) {
          req.flash("error", "Lecture update failed");
          return res.redirect(`/managesinglelecture/${lectureId}`);
        }

        req.flash("success", "Lecture updated successfully");
        return res.redirect(`/managesinglelecture/${lectureId}`);
      }
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect(`/managesinglelecture/${lectureId}`);
    }
  }

  async deleteLecture(req, res) {
    const { courseId, lectureId } = req.params;
    try {
      if (
        !mongooseValidObjectId(lectureId) ||
        !mongooseValidObjectId(courseId)
      ) {
        req.flash("error", "Invalid ids");
        return res.redirect(`/managelectures/${courseId}`);
      }

      const lecture = await Lecture.findOne({
        _id: lectureId,
        courseId,
      });

      if (!lecture) {
        req.flash("error", "Lecture not found");
        return res.redirect(`/managelectures/${courseId}`);
      }

      const deleteFormCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        {
          $pull: { lectures: lectureId },
        },
        {
          new: true,
        }
      );

      if (!deleteFormCourse) {
        req.flash("error", "Lecture delete failed from course");
        return res.redirect(`/managelectures/${courseId}`);
      }

      const deleteLecture = await Lecture.findOneAndUpdate(
        { _id: lectureId },
        {
          isDeleted: true,
        },
        { new: true }
      );

      if (!deleteLecture) {
        req.flash("error", "Lecture delete failed");
        return res.redirect(`/managelectures/${courseId}`);
      }

      req.flash("success", "Lecture deleted successfully");
      return res.redirect(`/managelectures/${courseId}`);
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect(`/managelectures/${courseId}`);
    }
  }
}

module.exports = new RenderAdminLecturePages();
