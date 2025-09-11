export type PriceRange = { from: number; to: number };

export interface ICourseImage {
  public_id: string;
  url: string;
}

export interface middlewareShape {
  _id: string;
  role: "user" | "instructor" | "admin";
  iat: number;
  exp: number;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "instructor" | "admin";
  profilePicture?: ICourseImage;
  gooleavatar?: string;
  faceBookavatar?: string;
  password: string;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  isDeleted: boolean;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface UserCourse {
  _id: string;
  instructorId: string;
  students: string[];
  instructorName: string;
  title: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  primaryLanguage: string;
  subtitle: string;
  description: string;
  welcomeMessage: string;
  pricing: number;
  image: ICourseImage;
  reviews: Review[];
  lectures: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SingleUserCourse {
  _id: string;
  instructorId: string;
  instructorName: string;
  title: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  primaryLanguage: string;
  subtitle: string;
  description: string;
  welcomeMessage: string;
  pricing: number;
  image: ICourseImage;
  students: string[];
  announcements: announcements[];
  orders: string[];
  isPublised: boolean;
  status: "draft" | "published" | "cancelled";
  isDeleted: boolean;
  lectures: Lecture[];
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Lecture {
  _id: string;
  courseId: SingleUserCourse;
  lecturerId: string;
  title: string;
  description: string;
  videos: {
    url: string;
    publix_id: string;
    duration: number;
  };
  freePreview: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InstructorLecture {
  _id: string;
  courseId: string;
  lecturerId: string;
  title: string;
  description: string;
  videos: {
    url: string;
    publix_id: string;
    duration: number;
  };
  freePreview: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface announcements {
  _id: string;
  courseId: string;
  lecturerId: string;
  title: string;
  description: string;
  isDeleted: boolean;
  lecturer: User;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  _id: string;
  userId: string;
  courses: UserCourse;
  isDeleted: boolean;
}

export interface Aiearch {
  _id: string;
  instructorId: string;
  instructorName: string;
  title: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  primaryLanguage: string;
  subtitle: string;
  description: string;
  welcomeMessage: string;
  pricing: number;
  image: ICourseImage;
  students: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LecturerDashboard {
  totalCourses: number;
  totalStudents: number;
  totalOrders: number;
  totalEarnings: number;
  calculatedCourseByyear: [
    { courseCount: number; year: number; month: number; day: number }
  ];
  totalEarningsOfyWeek: [{ totalEarnings: number; dayOfWeek: number }];
}

export interface LecturerCourse {
  _id: string;
  title: string;
  category: string;
  description: string;
  user: [
    {
      fullName: string;
      email: string;
      profilePicture: ICourseImage;
      gooleavatar: string;
      faceBookavatar: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
}

export interface LecturerOrder {
  _id: string;
  totalAmount: string;
  orderStatus: string;
  users: {
    fullName: string;
    email: string;
    profilePicture: ICourseImage;
    gooleavatar: string;
    faceBookavatar: string;
  };
  courses: {
    title: string;
    category: string;
    image: ICourseImage;
    pricing: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InstructorCourse {
  _id: string;
  instructorId: string;
  instructorName: string;
  title: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  primaryLanguage: string;
  subtitle: string;
  description: string;
  welcomeMessage: string;
  pricing: number;
  image: ICourseImage;
  isPublised: boolean;
  status: "draft" | "published" | "cancelled";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InstructorAnnouncement {
  _id: string;
  courseId: string;
  lecturerId: string;
  title: string;
  description: string;
  isDeleted: boolean;
  lecturer: {
    fullName: string;
    profilePicture: ICourseImage;
    gooleavatar: string;
    faceBookavatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  senderId: {
    fullName: string;
    profilePicture: ICourseImage;
    gooleavatar: string;
    faceBookavatar: string;
  };
  receiverId: string;
  messageType: string;
  title: string;
  message: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  _id: string;
  course: SingleUserCourse;
  courseId: string;
  instuctorId: string;
  reason: string;
  date: Date;
  time: string;
  meetingUrl: string;
  status: "Waiting" | "Scheduled" | "Completed" | "Live" | "Cancelled";
  userId: string;
  meetingId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  _id: string;
  userId: string;
  courseId: string;
  instructorId: string;
  meetingName: string;
  duration: number;
  roomId: string;
  date: Date;
  startTime: string;
  endTime: string;
  meetingUrl: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
