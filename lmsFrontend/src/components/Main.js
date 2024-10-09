import React from "react";
import Header from "./Header";
import Home from "./Home";
import CourseDetail from "./CourseDetail";
import Search from "./Search";
import TeacherDetail from "./TeacherDetail";
import { Navigate } from "react-router-dom";
// import { getToken } from "./LocalStorageService";

// // Auth based login pages
// import Signup from "../containers/Signup";
// import AuthLogin from "../containers/AuthLogin";
// import Activate from "../containers/Activate";
// import ResetPassword from "../containers/ResetPassword";
// import ResetPasswordConfirm from "../containers/ResetPasswordConfirm";

// Administrator
import AdministratorLogin from "./Admin/AdministratorLogin";
import AdministratorLogout from "./Admin/AdministratorLogout";
import AdminDashboard from "./Admin/AdminDashboard";
import EnrollStudents from "./Admin/EnrollStudents";

// Users
import Login from "./User/Login";
import Logout from "./User/StudentLogout";
import Register from "./User/Register";
import UserPersonalInformationRegister from "./User/UserPersonalInformationRegister";
import VerifyStudent from "./User/VerifyStudent";
import Dashboard from "./User/Dashboard";
import MyCourses from "./User/MyCourses";
import StudentCourseChapters from "./User/StudentCourseChapters";
import ChaptersIndex from "./User/ChaptersIndex";
import MyTeachers from "./User/MyTeachers";
import FavouriteCourses from "./User/FavouriteCourses";
import RecommendedCourses from "./User/RecommendedCourses";
import StudentAssignments from "./User/StudentAssignments";
import ProfileSettings from "./User/ProfileSettings";
import ChangePassword from "./User/ChangePassword";
import UserForgotPassword from "./User/UserForgotPassword";
import UserChangeForgotPassword from "./User/UserChangeForgotPassword";

// Online exam
import MyExams from "./User/MyExams";
import TakeExam from "./User/TakeExam";
import UserExamForm from "./User/UserExamForm";
import ExamList from "./User/ExamList";

// Teachers
import TeacherRegister from "./Teacher/TeacherRegister";
import TeacherPersonalInformationRegister from "./Teacher/TeacherPersonalInformationRegister";
import VerifyTeacher from "./Teacher/VerifyTeacher";
import TeacherLogin from "./Teacher/TeacherLogin";
//import TeacherLogin1 from "./Teacher/TeacherLogin1";
import TeacherLogout from "./Teacher/TeacherLogout";
import TeacherDashboard from "./Teacher/TeacherDashboard";
import TeacherCourses from "./Teacher/TeacherCourses";
import EnrolledStudents from "./Teacher/EnrolledStudents";
import AddCourse from "./Teacher/AddCourse";
import EditCourse from "./Teacher/EditCourse";
import AddChapter from "./Teacher/AddChapter";
import EditChapter from "./Teacher/EditChapter";
import AllChapters from "./Teacher/CourseChapters";
import UserList from "./Teacher/UserList";
import AddAssignment from "./Teacher/AddAssignment";
import ShowAssignment from "./Teacher/ShowAssignment";
import TeacherProfileSettings from "./Teacher/TeacherProfileSettings";
import TeacherChangePassword from "./Teacher/TeacherChangePassword";
import TeacherForgotPassword from "./Teacher/TeacherForgotPassword";
import TeacherChangeForgotPassword from "./Teacher/TeacherChangeForgotPassword";

// Teacher Dashboard Quiz
import AllQuizzes from "./Teacher/AllQuizzes";
import AddQuiz from "./Teacher/AddQuiz";
import EditQuiz from "./Teacher/EditQuiz";
import AddQuizQuestion from "./Teacher/AddQuizQuestion";
import EditQuestion from "./Teacher/EditQuestion";
import QuizQuestions from "./Teacher/QuizQuestions";
import AssignQuiz from "./Teacher/AssignQuiz";
import AttemptedStudents from "./Teacher/AttemptedStudents";

// Course Study Materials
import StudyMaterials from "./Teacher/StudyMaterials";
import AddStudyMaterial from "./Teacher/AddStudyMaterial";
import UserStudyMaterials from "./User/UserStudyMaterials";

// Student Dashboard Quiz
import CourseQuizList from "./User/CourseQuizList";
import TakeQuiz from "./User/TakeQuiz";

// List Pages
import AllCourses from "./AllCourses";
import PopularCourses from "./PopularCourses";
import CoursesByTech from "./CoursesByTech";
import PopularTeachers from "./PopularTeachers";
import Category from "./Category";
import CategoryCourses from "./CategoryCourses";
import TeacherSkillsCourses from "./TeacherSkillsCourses";

import Page from "./Page";
import Footer from "./Footer";
import FAQ from "./FAQ";
import ContactUs from "./ContactUs";

// test page
import AddRichText from "./Teacher/RichText";
import TextToSpeech from "./TextToSpeech";

// Online Exam
import CreateExam from "./Teacher/CreateExam";
import PostQuestion from "./Teacher/PostQuestion";
import MarkExam from "./Teacher/MarkExam";
import ViewMarksFeedback from "./User/ViewMarksFeedback";
import ExamSummary from "./Teacher/ExamSummary";
import AssignExam from "./Teacher/AssignExam";

// Offline Payment
import PaymentForm from "./Admin/PaymentForm";
import AccessCheck from "./User/AccessCheck";

import { Routes as Switch, Route } from "react-router-dom";

const teacherLoginStatus = localStorage.getItem("teacherLoginStatus");
const studentLoginStatus = localStorage.getItem("studentLoginStatus");
const adminLoginStatus = localStorage.getItem("adminLoginStatus");

function Main() {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:course_id" element={<CourseDetail />} />
        <Route path="/search/:searchstring" element={<Search />} />
        <Route
          path="/user-login"
          element={
            !studentLoginStatus ? <Login /> : <Navigate to="/user-dashboard" />
          }
        />
        <Route path="/user-logout" element={<Logout />} />
        <Route
          path="/user-register"
          element={
            !studentLoginStatus ? (
              <Register />
            ) : (
              <Navigate to="/user-dashboard" />
            )
          }
        />
        <Route
          path="/user-personal-info-register/"
          element={<UserPersonalInformationRegister />}
        />
        <Route path="/verify-student/:student_id" element={<VerifyStudent />} />
        <Route
          path="/user-dashboard"
          element={
            studentLoginStatus ? <Dashboard /> : <Navigate to="/user-login" />
          }
        />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route
          path="/student-course-chapters/:course_id"
          element={<StudentCourseChapters />}
        />
        <Route path="/chapters-index/:course_id" element={<ChaptersIndex />} />
        <Route path="/my-teachers" element={<MyTeachers />} />
        <Route
          path="/user/study-materials/:course_id"
          element={<UserStudyMaterials />}
        />
        <Route path="/favourite-courses" element={<FavouriteCourses />} />
        <Route path="/recommended-courses" element={<RecommendedCourses />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/change-password" element={<ChangePassword />} />
        {/* <Route path="/user-forgot-password" element={<UserForgotPassword />} />

        <Route
          path="/user-change-forgot-password/:uid/:token/"
          element={<UserChangeForgotPassword />}
        /> */}
        <Route path="/forgot-password" element={<UserForgotPassword />} />

        <Route
          path="/change-forgot-password/:uid/:token/"
          element={<UserChangeForgotPassword />}
        />

        {/* Student online exam */}
        <Route path="/my-exams" element={<MyExams />} />
        <Route path="/take-exam/:exam_id" element={<TakeExam />} />
        <Route path="/user-exam-form" element={<UserExamForm />} />
        <Route path="/exam-list" element={<ExamList />} />
        <Route
          path="/view-marks-feedback/:exam_id"
          element={<ViewMarksFeedback />}
        />

        {/* ========================================================================== */}
        {/* <Route path="/alogin" element={<AuthLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/activate/:uid/:token" element={<Activate />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/password/reset/confirm/:uid/:token"
          element={<ResetPasswordConfirm />}
        /> */}
        {/* ========================================================================== */}
        {/* ========================================================================== */}
        {/* <Route
          path="/teacher-forgot-password"
          element={<TeacherForgotPassword />}
        />
        <Route
          path="/teacher-change-forgot-password/:uid/:token/"
          element={<TeacherChangeForgotPassword />}
        /> */}
        {/* ========================================================================== */}
        {/* ========================================================================== */}
        {/* <Route
          path="sendpasswordresetemail"
          element={<SendPasswordResetEmail />}
        />
        <Route
          path="api/user/reset/:id/:token"
          element={<ResetPassword />}
        /> */}
        {/* <Route path="/teacher-login" element={<TeacherLogin />} /> */}
        <Route
          path="/teacher-login"
          element={
            !teacherLoginStatus ? (
              <TeacherLogin />
            ) : (
              <Navigate to="/teacher-dashboard" />
            )
          }
        />
        {/* <Route path="/teacher-login" element={<TeacherLogin1 />} /> */}
        <Route path="/teacher-logout" element={<TeacherLogout />} />
        <Route
          path="/teacher-register"
          element={
            !teacherLoginStatus ? (
              <TeacherRegister />
            ) : (
              <Navigate to="/teacher-dashboard" />
            )
          }
        />
        <Route
          path="/teacher-personal-info-register/"
          element={<TeacherPersonalInformationRegister />}
        />
        <Route path="/verify-teacher/:teacher_id" element={<VerifyTeacher />} />
        <Route
          path="/teacher-dashboard"
          element={
            teacherLoginStatus ? (
              <TeacherDashboard />
            ) : (
              <Navigate to="/teacher-login" />
            )
          }
        />
        <Route path="/teacher-courses" element={<TeacherCourses />} />
        <Route
          path="/enrolled-students/:course_id"
          element={<EnrolledStudents />}
        />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/edit-course/:course_id" element={<EditCourse />} />
        <Route path="/add-chapter/:course_id" element={<AddChapter />} />
        <Route
          path="/add-assignment/:student_id/:teacher_id"
          element={<AddAssignment />}
        />
        <Route
          path="/show-assignment/:student_id/:teacher_id"
          element={<ShowAssignment />}
        />
        <Route path="/my-assignments/" element={<StudentAssignments />} />

        <Route path="/quiz" element={<AllQuizzes />} />
        <Route path="/add-quiz" element={<AddQuiz />} />
        <Route path="/edit-quiz/:quiz_id" element={<EditQuiz />} />
        <Route path="/add-question/:quiz_id" element={<AddQuizQuestion />} />
        <Route path="/edit-question/:question_id" element={<EditQuestion />} />
        <Route path="/all-questions/:quiz_id" element={<QuizQuestions />} />
        <Route path="/assign-quiz/:course_id" element={<AssignQuiz />} />
        <Route
          path="/attempted-students/:quiz_id"
          element={<AttemptedStudents />}
        />

        <Route path="/course-quiz/:course_id" element={<CourseQuizList />} />
        <Route path="/take-quiz/:quiz_id" element={<TakeQuiz />} />

        <Route
          path="/study-materials/:course_id"
          element={<StudyMaterials />}
        />
        <Route path="/add-study/:course_id" element={<AddStudyMaterial />} />
        {/* <Route path="/edit-study/:study_id" element={<EditChapter />} /> */}

        <Route path="/teacher-users" element={<UserList />} />
        <Route path="/add-richtext" element={<AddRichText />} />
        <Route
          path="/teacher-profile-settings"
          element={<TeacherProfileSettings />}
        />
        <Route
          path="/teacher-change-password"
          element={<TeacherChangePassword />}
        />
        <Route path="/teacher-detail/:teacher_id" element={<TeacherDetail />} />
        <Route path="/all-courses" element={<AllCourses />} />
        <Route path="/courses-by-tech/:tech" element={<CoursesByTech />} />
        <Route path="/all-chapters/:course_id" element={<AllChapters />} />
        <Route path="/edit-chapter/:chapter_id" element={<EditChapter />} />
        <Route path="/popular-courses" element={<PopularCourses />} />
        <Route path="/popular-teachers" element={<PopularTeachers />} />
        <Route path="/category" element={<Category />} />
        {/* <Route path="/category/:category_slug" element={<CategoryCourses />} /> */}
        <Route
          path="/course/:category_id/:category_slug"
          element={<CategoryCourses />}
        />
        <Route
          path="/teacher-skills-courses/:skill_name/:teacher_id"
          element={<TeacherSkillsCourses />}
        />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/pages/:page_id/:page_slug" element={<Page />} />
        <Route path="/contact-us" element={<ContactUs />} />

        <Route path="/tts" element={<TextToSpeech />} />
        <Route
          path="/administrator"
          element={
            adminLoginStatus ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <AdministratorLogin />
            )
          }
        />
        <Route path="/admin-logout" element={<AdministratorLogout />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/enroll-students" element={<EnrollStudents />} />

        <Route path="/create-exam" element={<CreateExam />} />
        <Route path="/assign-exam/:course_id" element={<AssignExam />} />
        <Route path="/post-question" element={<PostQuestion />} />
        <Route path="/mark-exam" element={<MarkExam />} />
        {/* <Route path="/exams/:examId/summary/" element={<ExamSummary />} /> */}
        <Route path="/exam-summary/" element={<ExamSummary />} />

        <Route path="/payment-form" element={<PaymentForm />} />

        <Route path="/access-check" element={<AccessCheck />} />
      </Switch>
      <Footer />
    </div>
  );
}

export default Main;
