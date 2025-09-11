const Course = require("../../../models/courseModel");
const Notification = require("../../../models/notificationModel");
const {
  updateCourseValidation,
} = require("../../../helpers/validation/course/courseValidator");
const { uploadFile, deleteImage } = require("../../../helpers/cloudinary");
const mongooseValidObjectId = require("mongoose").isValidObjectId;
class RenderAdminCoursePages {
  async renderCoursePage(req, res) {
    try {
      const findCourse = await Course.find({
        isDeleted: false,
        isPublised: true,
      })
        .select("-__v -orders -announcements -lectures -reviews -students")
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      if (!findCourse) {
        req.flash("error", "Failed to get course");
        return res.redirect("/managecourses");
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

      res.render("manage-courses", {
        title: "courses",
        notifications,
        user: req.user,
        courses: findCourse,
        error: req.flash("error"),
        success: req.flash("success"),
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/managecourses");
    }
  }

  async renderSingelCourse(req, res) {
    const { id } = req.params;

    const findCourse = await Course.findById(id)
      .select("-__v -orders -announcements -lectures -reviews -students")
      .lean()
      .exec();

    if (!findCourse) {
      req.flash("error", "Failed to get course");
      return res.redirect(`/managesinglecourses}`);
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

    res.render("manage-single-courses", {
      title: "courses",
      course: findCourse,
      notifications,
      user: req.user,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  }

  async updateCourse(req, res) {
    const {
      courseId,
      title,
      category,
      level,
      primaryLanguage,
      subtitle,
      description,
      welcomeMessage,
      pricing,
    } = req.body;

    try {
      const image = req?.file?.path;

      if (!mongooseValidObjectId(courseId)) {
        req.flash("error", "Invalid course id");
        return res.redirect(`/managesinglecourses/${courseId}`);
      }

      const { error } = updateCourseValidation(req.body);

      if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect(`/managesinglecourses/${courseId}`);
      }

      const getCourse = await Course.findById(courseId);

      if (!getCourse) {
        req.flash("error", "Failed to get course");
        return res.redirect(`/managesinglecourses/${courseId}`);
      }

      if (image) {
        await deleteImage(getCourse.image.public_id);

        const uploadImage = await uploadFile(image);

        if (!uploadImage) {
          req.flash("error", "Failed to upload new profile picture");
          return res.redirect(`/managesinglecourses/${courseId}`);
        }

        const updateCourse = await Course.findByIdAndUpdate(
          courseId,
          {
            title: title || getCourse.title,
            category: category || getCourse.category,
            level: level || getCourse.level,
            primaryLanguage: primaryLanguage || getCourse.primaryLanguage,
            subtitle: subtitle || getCourse.subtitle,
            description,
            image: {
              public_id: uploadImage.publicId || getCourse.image.public_id,
              url: uploadImage.url || getCourse.image.url,
            },
            welcomeMessage: welcomeMessage || getCourse.welcomeMessage,
            pricing: pricing || getCourse.pricing,
          },
          { new: true }
        );

        if (!updateCourse) {
          req.flash("error", "Failed to update course");
          return res.redirect(`/managesinglecourses/${courseId}`);
        }

        req.flash("success", "Course updated successfully");
        return res.redirect(`/managesinglecourses/${courseId}`);
      } else {
        const updateCourse = await Course.findByIdAndUpdate(
          courseId,
          {
            title: title || getCourse.title,
            category: category || getCourse.category,
            level: level || getCourse.level,
            primaryLanguage: primaryLanguage || getCourse.primaryLanguage,
            subtitle: subtitle || getCourse.subtitle,
            description,
            welcomeMessage: welcomeMessage || getCourse.welcomeMessage,
            pricing: pricing || getCourse.pricing,
          },
          { new: true }
        );

        if (!updateCourse) {
          req.flash("error", "Failed to update course");
          return res.redirect(`/managesinglecourses/${courseId}`);
        }

        req.flash("success", "Course updated successfully");
        return res.redirect(`/managesinglecourses/${courseId}`);
      }
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect(`/managesinglecourses/${courseId}`);
    }
  }

  async deleteCourse(req, res) {
    try {
      const courseId = req.params.id;

      if (!mongooseValidObjectId(courseId)) {
        req.flash("error", "Invalid course ID");
        return res.redirect("/managecourses");
      }

      const deleteCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          isDeleted: true,
        },
        { new: true }
      );

      if (!deleteCourse) {
        req.flash("error", "Failed to delete course");
        return res.redirect("/managecourses");
      }

      req.flash("success", "Course deleted successfully");
      return res.redirect("/managecourses");
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/managecourses");
    }
  }
}

module.exports = new RenderAdminCoursePages();
