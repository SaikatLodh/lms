const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const env = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const { setIO, userSocketIDs, onlineUsers } = require("./config/socketStore");
const { ONLINE_USERS } = require("./config/socketKeys");
const socketAuthenticator = require("./middleware/socketAuthenticator");

const app = express();
const server = http.createServer(app);

env.config({ path: ".env" });

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(function (_, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS,HEAD,PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});
setIO(io);

app.set("trust proxy", 1);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: process.env.SESSOIN_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

const authRoute = require("./routes/auth/api/authRoutes");
const adminRoute = require("./routes/admin/api/adminRoute");
const instructorRoute = require("./routes/instructor/instructorRoute");
const userRoutes = require("./routes/user/userRoutes");
const courseRoute = require("./routes/course/api/courseRoute");
const lectureRoute = require("./routes/lecture/api/lectureRoute");
const announcementRoute = require("./routes/announcement/announcementRoute");
const courseProgressRoute = require("./routes/courseProgress/courseProgressRoute");
const addtocartRoute = require("./routes/addtocart/addtocartRoute");
const wishlistRoute = require("./routes/wishlist/wishlistRoute");
const reviewRoute = require("./routes/review/reviewRoutes");
const orderRoute = require("./routes/order/orderRoute");
const aiSearchRoute = require("./routes/aisearch/aiSearchRoute");
const contactSupportRoute = require("./routes/contactsupport/contactSupportRoute");
const notificationRoute = require("./routes/notification/notificationRoute");
const scheduleRoute = require("./routes/schedule/scheduleroute");
const meetingRoute = require("./routes/meeting/meetingRoute");

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/instructor", instructorRoute);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/lecture", lectureRoute);
app.use("/api/v1/announcement", announcementRoute);
app.use("/api/v1/courseprogress", courseProgressRoute);
app.use("/api/v1/addtocart", addtocartRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/aisearch", aiSearchRoute);
app.use("/api/v1/contactsupport", contactSupportRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/schedule", scheduleRoute);
app.use("/api/v1/meeting", meetingRoute);

const adminAuthRender = require("./routes/auth/ejs/renderAuthPages");
const adminPages = require("./routes/admin/ejs/renderAdminPages");
const adminCourse = require("./routes/course/ejs/renderAdminCoursePages");
const adminLecture = require("./routes/lecture/ejs/randerAdminLecturePages");

app.use(adminAuthRender);
app.use(adminPages);
app.use(adminCourse);
app.use(adminLecture);

io.use((Socket, next) => {
  cookieParser()(
    Socket.request,
    Socket.request.res,
    async (err) => await socketAuthenticator(err, Socket, next)
  );
});

io.on("connection", (socket) => {
  const user = socket.user;
  userSocketIDs.set(user._id.toString(), socket.id);
  onlineUsers.add(user._id.toString());

  io.emit(ONLINE_USERS, Array.from(onlineUsers));

  socket.on("disconnect", () => {
    if (userSocketIDs.has(user._id.toString())) {
      userSocketIDs.delete(user._id.toString());
    }
    if (onlineUsers.has(user._id.toString())) {
      onlineUsers.delete(user._id.toString());
    }

    io.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

module.exports = server;
