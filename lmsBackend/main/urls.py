from django.urls import path
from . import views
# from .views import get_courses_by_tech

from accounts.views import SendPasswordResetEmailView, UserChangePasswordView, UserLoginView, UserProfileView, UserRegistrationView, UserPasswordResetView
# urlpatterns = [
#     path('register/', UserRegistrationView.as_view(), name='register'),
#     path('login/', UserLoginView.as_view(), name='login'),
#     path('profile/', UserProfileView.as_view(), name='profile'),
#     path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
#     path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
#     path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),

# ]


urlpatterns = [
    # User -----------------------------------------------------------------------------------------
    path('user/register/', UserRegistrationView.as_view(), name='register'),
    path('user/login/', UserLoginView.as_view(), name='login'),
    path('user/profile/', UserProfileView.as_view(), name='profile'),
    path('user/changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('user/send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('user/reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
    # -----------------------------------------------------------------------------------------------

    # Teacher
    path('teacher/', views.TeacherList.as_view(), name='teacher-list'),
    path('teacher/<int:user_id>/', views.TeacherDetailByUserId.as_view(), name='teacher-detail-by-user-id'),
    # URL for posting personal details of a teacher
    path('teacher-personal-info-register/', views.TeacherList.as_view()),
    path('teacher/register/', views.TeacherList.as_view()),
    # Form for posting personal details of the teacher along with the user id created in the User model
    # path('user/teacher-personal-info-register/', views.TeacherList.as_view()),
    path('teacher/dashboard/<int:pk>/', views.TeacherDashboard.as_view()),
    # for admin dashboard
    path('admin/dashboard/', views.AdminDashboard.as_view(), name='admin-dashboard'),
    # path('teacher/<int:pk>/', views.TeacherDetail.as_view()),
    # newly added to handle user_id based put query to update teacher profile
    path('teacher-profile/<int:pk>/', views.TeacherDetail.as_view()),
    path('teacher/change-password/<int:teacher_id>/', views.teacherChangePassword),
    # path('teacher-forgot-password/', views.teacherForgotPassword),
    # path('teacher-forgot-password/', SendPasswordResetEmailView.as_view()),
    # path('teacher-change-forgot-password/<int:teacher_id>/', views.teacherChangeForgotPassword),
    # path('teacher-change-forgot-password/<uid>/<token>/', UserPasswordResetView.as_view()),
    path('teacher-login', views.teacherLogin),
    path('verify-teacher/<int:teacher_id>/', views.verifyTeacherViaOTP),
    path('popular-teachers/', views.TeacherList.as_view(), {'popular': 'true'}, name='popular-teachers'),
    path('all-teachers/', views.TeacherList.as_view(), {'all': 'true'}, name='all-teachers'),
    # Category
    path('category/', views.CatetoryList.as_view()),
    # Course
    path('course/', views.CourseList.as_view()),
    # path('course/<int:category_id>', views.CourseList.as_view()), # should work without this link
    path('popular-course/', views.CourseRatingList.as_view(), name='popular-course'),
    path('search-courses/<str:searchstring>', views.CourseList.as_view()),
    path('update-view/<int:course_id>', views.updateView),
    # Course detail -- newly added
    path('course/<int:pk>', views.CourseDetailView.as_view()),
    # Course by tech
    path('courses-by-tech/<str:tech>/', views.CoursesByTechView.as_view(), name='courses-by-tech'),
    # path('courses_by_tech/<str:tech>/', views.get_courses_by_tech, name='courses_by_tech'),
    # Specific course chapter
    path('course-chapters/<int:course_id>', views.CourseChapterList.as_view()),
    # URL for uploading chapter
    path('chapter/', views.ChapterList.as_view()),    
    # Specific Chapter - URL for edit/updating chapter (uses chapter id to identify specific chapter)
    path('chapter/<int:pk>', views.ChapterDetailview.as_view()),
    # Teacher Courses
    path('teacher-courses/<int:teacher_id>', views.TeacherCourseList.as_view()),
    # Course detail
    path('teacher-course-detail/<int:pk>', views.TeacherCourseDetail.as_view()),

    # Students' Testimonials
    # path('student-testimonial/', views.CourseRatingList.as_view()),
    # New view for this url
    path('student-testimonial/', views.StudentTestimonialList.as_view()),

    # Student
    path('student/', views.StudentList.as_view()),
    path('student/<int:user_id>/', views.StudentDetailByUserId.as_view(), name='student-detail-by-user-id'),
    # URL for posting personal details of a teacher
    path('user-personal-info-register/', views.StudentList.as_view()),
    path('verify-student/<int:student_id>/', views.verifyStudentViaOTP),
    path('student/dashboard/<int:pk>/', views.StudentDashboard.as_view()),
    path('student-profile/<int:pk>/', views.StudentDetail.as_view()),
    path('student/change-password/<int:student_id>/', views.studentChangePassword),
    # path('user-forgot-password/', views.userForgotPassword),
    path('forgot-password/', SendPasswordResetEmailView.as_view()),
    # path('user-change-forgot-password/<int:student_id>/', views.userChangeForgotPassword),
    path('change-forgot-password/<uid>/<token>/', UserPasswordResetView.as_view()),
    path('student-login', views.studentLogin),
    path('student-enroll-course/', views.StudentEnrollCourseList.as_view()),
    # newly added for admin dashboard
    path('enroll/', views.EnrollStudentView.as_view(), name='enroll-student'),
    path('fetch-enroll-status/<int:student_id>/<int:course_id>', views.fetchEnrollStatus),
    # newly added to for fetching enrolled courses based on category
    path('enrollments/<int:student_id>/<int:category_id>/', views.fetch_enroll_status, name='fetch_enroll_status'),
    path('fetch-all-enrolled-students/<int:teacher_id>', views.EnrolledStudentsList.as_view()),
    path('fetch-enrolled-students/<int:course_id>', views.EnrolledStudentsList.as_view()),
    path('fetch-enrolled-courses/<int:student_id>', views.EnrolledStudentsList.as_view()),
    path('fetch-enrolled-students/<int:course_id>/<int:teacher_id>/', views.EnrolledStudentsList.as_view()),  # New URL pattern
    path('fetch-recommended-courses/<int:studentId>', views.CourseList.as_view()), # this url
    path('course-rating/', views.CourseRatingList.as_view()),
    path('fetch-rating-status/<int:student_id>/<int:course_id>', views.fetchRatingStatus),
    path('student-add-favourite-course/', views.StudentFavouriteCourseList.as_view()),
    path('student-remove-favourite-course/<int:course_id>/<int:student_id>', views.removeFavouriteCourse),
    path('fetch-favourite-status/<int:student_id>/<int:course_id>', views.fetchFavouriteStatus),
    path('fetch-favourite-courses/<int:student_id>', views.StudentFavouriteCourseList.as_view()),
    path('student-assignment/<int:teacher_id>/<int:student_id>', views.AssignmentList.as_view()),
    path('my-assignments/<int:studentId>', views.MyAssignmentsList.as_view()),
    path('update-assignment/<int:pk>', views.UpdateAssignment.as_view()),
    path('student/fetch-all-notifications/<int:student_id>', views.NotificationList.as_view()),
    path('save-notification/', views.NotificationList.as_view()),

    # Quiz
    path('quiz/', views.QuizList.as_view()),
    path('teacher-quiz/<int:teacher_id>', views.TeacherQuizList.as_view()),
    path('teacher-quiz-detail/<int:pk>', views.TeacherQuizDetail.as_view()),
    path('quiz/<int:pk>', views.QuizDetailview.as_view()),
    path('quiz-questions/<int:quiz_id>', views.QuizQuestionsList.as_view()),
    path('quiz-questions/<int:quiz_id>/<int:limit>', views.QuizQuestionsList.as_view()),
    path('update-quiz-question/<int:pk>', views.QuestionDetailview.as_view()),
    path('fetch-quiz-assign-status/<int:quiz_id>/<int:course_id>', views.fetchQuizAssignStatus),
    path('quiz-assign-course/', views.CourseQuizList.as_view()),
    path('fetch-assigned-quiz/<int:course_id>', views.CourseQuizList.as_view()),
    path('attempt-quiz/', views.AttemptQuizList.as_view()),
    path('quiz-questions/<int:quiz_id>/next-question/<int:question_id>', views.QuizQuestionsList.as_view()),
    path('fetch-quiz-attempt-status/<int:quiz_id>/<int:student_id>', views.fetchQuizAttemptStatus),
    path('attempted-quiz/<int:quiz_id>', views.AttemptQuizList.as_view()),
    path('fetch-quiz-result/<int:quiz_id>/<int:student_id>', views.fetchQuizResult),
    path('faq/', views.FaqList.as_view()),

    # Study Materials
    path('study-materials/<int:course_id>', views.StudyMaterialList.as_view()),
    path('study-material/<int:pk>', views.StudyMaterialDetailView.as_view()),
    path('user/study-materials/<int:course_id>', views.StudyMaterialList.as_view()),
    path('pages/', views.FlatPagesList.as_view()),
    path('pages/<int:pk>/<str:page_slug>/', views.FlatPagesDetail.as_view()),
    path('contact/', views.ContactList.as_view()),

    path('send-message/<int:teacher_id>/<int:student_id>', views.saveTeacherStudentMessage),
    path('get-messages/<int:teacher_id>/<int:student_id>', views.MessagesList.as_view()),

    path('send-group-message/<int:teacher_id>', views.saveTeacherStudentGroupMessage),
    path('send-group-message-from-student/<int:student_id>', views.saveTeacherStudentGroupMessageFromStudent),
    
    path('fetch-my-teachers/<int:student_id>', views.MyTeachersList.as_view()),

    # Online exam
    path('exams/', views.ExamListCreateView.as_view(), name='exam-list-create'),
    path('exams/<int:pk>/', views.ExamDetailView.as_view(), name='exam-detail'),
    path('teacher-exams/<int:teacher_id>/', views.TeacherExamListView.as_view(), name='teacher-exams'),
    path('exams/<int:pk>/summary/', views.ExamSummaryView.as_view(), name='exam-summary'),
    path('student-exams/', views.StudentExamListCreateView.as_view(), name='student-exam-list-create'),
    path('student-exams/<int:pk>/', views.StudentExamDetailView.as_view(), name='student-exam-detail'),
    path('student-exams/student/<int:student_id>/', views.StudentExamsByStudentView.as_view(), name='student-exams-by-student'),
    path('student-assigned-exams/<int:student_id>/', views.StudentAssignedExamsView.as_view(), name='student-assigned-exams'),
    path('available-exams/<int:student_id>/', views.AvailableExamsForStudentView.as_view(), name='available-exams'),
    path('assign-exam/', views.AssignExamToStudentView.as_view(), name='assign-exam'),
    path('start-exam/', views.StartExamView.as_view(), name='start-exam'),
    path('submit-exam/', views.SubmitExamView.as_view(), name='submit-exam'),
    # path('student-exams/<int:pk>/', StudentExamUpdateView.as_view(), name='student-exam-update'),
    path('questions/', views.QuestionListCreateView.as_view(), name='question-list-create'),
    path('questions/<int:pk>/', views.QuestionDetailView.as_view(), name='question-detail'),
    path('answers/', views.AnswerListCreateView.as_view(), name='answer-list-create'),
    path('answers/<int:pk>/', views.AnswerDetailView.as_view(), name='answer-detail'),
    path('answers/<int:pk>/mark/', views.AnswerUpdateView.as_view(), name='answer-mark'),
    path('answers-by-student-exam/<int:student_exam_id>/', views.AnswerListByStudentExamView.as_view(), name='answers-by-student-exam'),

    # Offline Payment
    path('payments/', views.PaymentListCreateView.as_view(), name='payment-list-create'),
    path('check-access/', views.CheckAccessView.as_view(), name='check-access'),
]