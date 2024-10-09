from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, Http404

from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Count, Sum, Avg
from django.contrib.flatpages.models import FlatPage
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers, generics
from rest_framework.exceptions import NotFound
from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view
from django.core.mail import send_mail
from .serializers import TeacherSerializer, CategorySerializer, courseSerializer, RelatedCourseSerializer, ChapterSerializer, StudentSerializer, StudentCourseEnrollSerializer, CourseRatingSerializer, CourseWithAvgRatingSerializer, CourseTestimonialSerializer, TeacherDashboardSerializer, StudentFavouriteCourseSerializer, StudentAssignmentSerializer, StudentDashboardSerializer, NotificationSerializer, QuizSerializer, QuizQuestionsSerializer, CourseQuizSerializer, AttemptQuizSerializer, StudyMaterialSerializer, FAQSerializer, FlatPageSerializer, ContactSerializer, TeacherStudentChatSerializer, ExamSerializer, StudentExamSerializer, QuestionSerializer, AnswerSerializer, PaymentSerializer, AdminDashboardSerializer
from . import models
from random import randint
from accounts.models import User
from accounts import views
import logging
# for online exam -----------------------

logger = logging.getLogger(__name__)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 8

class TeacherList(generics.ListCreateAPIView):
    serializer_class = TeacherSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if 'popular' in self.request.GET:
            return models.Teacher.objects.annotate(total_courses=Count('teacher_courses')).order_by('-total_courses')[:4]

        if 'all' in self.request.GET:
            return models.Teacher.objects.annotate(total_courses=Count('teacher_courses')).order_by('-total_courses')

        return models.Teacher.objects.all()

class TeacherDetailByUserId(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            teacher = models.Teacher.objects.get(user_id=user_id)
            serializer = TeacherSerializer(teacher)
            return Response(serializer.data)
        except models.Teacher.DoesNotExist:
            raise NotFound("Teacher not found------/////")

class TeacherDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Teacher.objects.all()
    serializer_class = TeacherSerializer
    #permission_classes = [permissions.IsAuthenticated]
    # teacher = models.Teacher.objects.filter(pk=4).first()
    # print("Teacher------>",teacher)  # Should not be None

    def get_object(self):
        id = self.kwargs['pk']
        return models.Teacher.objects.get(id=id)

class TeacherDashboard(generics.RetrieveAPIView):
    queryset = models.Teacher.objects.all()
    serializer_class = TeacherDashboardSerializer

class AdminDashboard(APIView):
    def get(self, request):
        data = {
            'totalTeachers': models.Teacher.objects.count(),
            'totalStudents': models.StudentCourseEnrollment.objects.count(),
            'totalCourses': models.course.objects.count(),
            'totalChapters': models.Chapter.objects.count(),
            'totalExams': models.Exam.objects.count(),
            'totalQuizzes': models.Quiz.objects.count(),
        }
        serializer = AdminDashboardSerializer(data)
        return Response(serializer.data)

@csrf_exempt
def teacherLogin(request):
    email = request.POST['email']
    password = request.POST['password']
    try:
        teacherData = models.Teacher.objects.get(email=email, password=password)
    except models.Teacher.DoesNotExist:
        teacherData=None
    if teacherData:
        if not teacherData.verify_status:
            return JsonResponse({'bool':False, 'msg':'Account is not verified!'})
        else:
            if teacherData.login_via_otp:
                otp_digits = randint(100000, 999999)
                # Send OTP email
                send_mail(
                "Verify Account",
                "Please verify your account.",
                "irshad.shaikh@gmail.com",
                [teacherData.email],
                fail_silently=False,
                html_message=f'<p>Your OTP is </p><p>{otp_digits}</p>'
                )
                teacherData.otp_digits=otp_digits
                teacherData.save()
                return JsonResponse({'bool':True, 'teacher_id':teacherData.id, 'login_via_otp':True})
            else:
                return JsonResponse({'bool':True, 'teacher_id':teacherData.id, 'login_via_otp':False})
    else:
        return JsonResponse({'bool':False, 'msg':'Invalid Email or Password!'})

@csrf_exempt    
def verifyTeacherViaOTP(request, teacher_id):
    otp_digits = request.POST.get('otp_digits')
    verify = models.Teacher.objects.filter(id=teacher_id, otp_digits=otp_digits).first()
    if verify:
        models.Teacher.objects.filter(id=teacher_id, otp_digits=otp_digits).update(verify_status=True)
        return JsonResponse({'bool':True, 'teacher_id':verify.id})
    else:
        return JsonResponse({'bool':False, 'msg': 'Please enter valid 6 digit OTP'})
    
class CatetoryList(generics.ListCreateAPIView):
    queryset = models.courseCategory.objects.all()
    serializer_class = CategorySerializer

# Course
class CourseList(generics.ListCreateAPIView):
    queryset = models.course.objects.all().order_by("-id") # order_by newly added
    serializer_class = courseSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = super().get_queryset()
        if "result" in self.request.GET:
            limit = int(self.request.GET['result'])
            qs = models.course.objects.all().order_by("-id")[:limit]

        if "category" in self.request.GET:
            category = self.request.GET['category']
            category = models.courseCategory.objects.filter(id=category).first()
            qs = models.course.objects.filter(category=category)

        if "skill_name" in self.request.GET and "teacher" in self.request.GET:
            skill_name = self.request.GET['skill_name']
            teacher = self.request.GET['teacher']
            teacher = models.Teacher.objects.filter(id=teacher).first()
            qs = models.course.objects.filter(techs__icontains=skill_name, teacher=teacher)

        if "searchstring" in self.kwargs:
            search = self.kwargs['searchstring']
            if search:
                qs = models.course.objects.filter(Q(title__icontains=search) | Q(techs__icontains=search))
                
        elif 'studentId' in self.kwargs: 
            student_id = self.kwargs['studentId']
            student = models.Student.objects.get(pk=student_id)
            # print(student.interestedCategories)
            queries = [Q(techs__iendswith=value) for value in student.interestedCategories]
            query = queries.pop()
            for item in queries:
                query |= item
            qs = models.course.objects.filter(query)
            # print(qs.query)
            return qs
        
        return qs

# Course detail view (RetriveAPIView changed to RetrieveUpdateDestroyAPIView to handle delete course)
class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.course.objects.all()
    serializer_class = courseSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

# Course by technology    
class CoursesByTechView(generics.ListAPIView):
    queryset = models.course.objects.all()
    serializer_class = courseSerializer

    def get_queryset(self):
        tech = self.kwargs['tech']
        qs = models.course.objects.filter(Q(title__icontains=tech) | Q(title__iexact=tech))
        return qs
        # return models.course.objects.filter(tech)
        # return models.course.objects.filter(techs__icontains=tech).filter(
        #    Q(techs__icontains=tech) | Q(title__iexact=tech)
        #)
    
# @api_view(['GET'])
# def get_courses_by_tech(request, tech):
#     courses = models.course.objects.filter(techs__icontains=tech)
#     serializer = RelatedCourseSerializer(courses, many=True, context={'request': request})
#     return Response(serializer.data)

# # Specific teacher course
# class TeacherCourseList(generics.ListAPIView):
#     serializer_class = courseSerializer

#     def get_queryset(self):
#         teacher_id = self.kwargs["teacher_id"]
#         teacher = models.Teacher.objects.get(pk=teacher_id)
#         return models.course.objects.filter(teacher=teacher)
    
# Specific teacher course
class TeacherCourseList(generics.ListCreateAPIView):
    serializer_class = courseSerializer

    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        teacher = models.Teacher.objects.get(pk=teacher_id)
        return models.course.objects.filter(teacher=teacher)

    
# Specific teacher course
class TeacherCourseDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.course.objects.all()
    serializer_class = courseSerializer
    
# Chapters list
class ChapterList(generics.ListCreateAPIView):
    queryset = models.Chapter.objects.all()
    serializer_class = ChapterSerializer

# Course Chapters List (ListAPIView modified to ListCreateAPIView)
class CourseChapterList(generics.ListCreateAPIView):
    serializer_class = ChapterSerializer

    def get_queryset(self):
        course_id = self.kwargs["course_id"]
        course = models.course.objects.get(pk=course_id)
        return models.Chapter.objects.filter(course=course)

    def list(self, request, *args, **kwargs):
        course_id = self.kwargs["course_id"]
        course = models.course.objects.get(pk=course_id)
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        response_data = {
            'course_title': course.title,
            'course_chapters': serializer.data
        }
        return Response(response_data)

# Specific Chapter
class ChapterDetailview(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Chapter.objects.all()
    serializer_class = ChapterSerializer

    # def get_serializer_context(self):
    #     context = super().get_serializer_context()
    #     context['chapter_duration'] = self.chapter_duration
    #     print("context......................")
    #     print(context)
    #     return context

# Student Data
class StudentList(generics.ListCreateAPIView):
    queryset = models.Student.objects.all()
    serializer_class = StudentSerializer
    #permission_classes = [permissions.IsAuthenticated] 

class StudentDetailByUserId(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            student = models.Student.objects.get(user_id=user_id)
            serializer = StudentSerializer(student)
            return Response(serializer.data)
        except models.Student.DoesNotExist:
            raise NotFound("Student not found")

class StudentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Student.objects.all()
    serializer_class = StudentSerializer
    #permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        id = self.kwargs['pk']
        return models.Student.objects.get(id=id)

class StudentDashboard(generics.RetrieveAPIView):
    queryset = models.Student.objects.all()
    serializer_class = StudentDashboardSerializer

@csrf_exempt
def studentLogin(request):
    email = request.POST['email']
    password = request.POST['password']
    try:
        studentData = models.Student.objects.get(email=email, password=password)
    except models.Student.DoesNotExist:
        studentData=None
    if studentData:
        if not studentData.verify_status:
            return JsonResponse({'bool':False, 'msg':'Account is not verified!'})
        else:
            if studentData.login_via_otp:
                otp_digits = randint(100000, 999999)
                # Send OTP email
                send_mail(
                "Verify Account",
                "Please verify your account.",
                "irshad.shaikh@gmail.com",
                [studentData.email],
                fail_silently=False,
                html_message=f'<p>Your OTP is </p><p>{otp_digits}</p>'
                )
                studentData.otp_digits=otp_digits
                studentData.save()
                return JsonResponse({'bool':True, 'student_id':studentData.id, 'login_via_otp':True})
            else:
                return JsonResponse({'bool':True, 'student_id':studentData.id, 'login_via_otp':False})
    else:
        return JsonResponse({'bool':False, 'msg':'Invalid Email or Password!'})

@csrf_exempt    
def verifyStudentViaOTP(request, student_id):
    otp_digits = request.POST.get('otp_digits')
    verify = models.Student.objects.filter(id=student_id, otp_digits=otp_digits).first()
    if verify:
        models.Student.objects.filter(id=student_id, otp_digits=otp_digits).update(verify_status=True)
        return JsonResponse({'bool':True, 'student_id':verify.id})
    else:
        return JsonResponse({'bool':False, 'msg': 'Please enter valid 6 digit OTP'})
    
class StudentEnrollCourseList(generics.ListCreateAPIView):
    queryset = models.StudentCourseEnrollment.objects.all()
    serializer_class = StudentCourseEnrollSerializer

class StudentFavouriteCourseList(generics.ListCreateAPIView):
    queryset = models.StudentFavouriteCourse.objects.all()
    serializer_class = StudentFavouriteCourseSerializer

    def get_queryset(self):
        if 'student_id' in self.kwargs:
            student_id = self.kwargs["student_id"]
            student = models.Student.objects.get(pk=student_id)
            return models.StudentFavouriteCourse.objects.filter(student=student).distinct('id')

def fetchEnrollStatus(request, student_id, course_id):
    student = models.Student.objects.filter(id=student_id).first()
    course = models.course.objects.filter(id=course_id).first()
    enrollStatus = models.StudentCourseEnrollment.objects.filter(student=student, course=course).count()
    if enrollStatus:
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})
    
@api_view(['GET'])
def fetch_enroll_status(request, student_id, category_id):
    student = models.Student.objects.filter(id=student_id).first()
    courses_in_category = models.course.objects.filter(category_id=category_id)
    enrollments = models.StudentCourseEnrollment.objects.filter(student=student, course__in=courses_in_category)

    enrolled_courses = enrollments.values_list('course_id', flat=True)
    
    response_data = {
        'enrolled_courses': list(enrolled_courses)
    }
    
    return Response(response_data)

    
def fetchFavouriteStatus(request, student_id, course_id):
    student = models.Student.objects.filter(id=student_id).first()
    course = models.course.objects.filter(id=course_id).first()
    favouriteStatus = models.StudentFavouriteCourse.objects.filter(course=course, student=student).first()
    if favouriteStatus and favouriteStatus.status == True:
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})
    
def removeFavouriteCourse(request, course_id, student_id):
    student = models.Student.objects.filter(id=student_id).first()
    course = models.course.objects.filter(id=course_id).first()
    favouriteStatus = models.StudentFavouriteCourse.objects.filter(course=course, student=student).delete()
    if favouriteStatus:
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})

    
class EnrolledStudentsList(generics.ListAPIView):
    queryset = models.StudentCourseEnrollment.objects.all()
    serializer_class = StudentCourseEnrollSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        if 'course_id' in self.kwargs and 'teacher_id' in self.kwargs:
            course_id = self.kwargs["course_id"]
            teacher_id = self.kwargs["teacher_id"]
            course = models.course.objects.filter(pk=course_id, teacher_id=teacher_id).first()
            if course:
                return queryset.filter(course=course)
            else:
                return queryset.none()
        elif 'course_id' in self.kwargs:
            course_id = self.kwargs["course_id"]
            course = models.course.objects.get(pk=course_id)
            return queryset.filter(course=course)
            # return models.StudentCourseEnrollment.objects.filter(course=course)
        elif 'teacher_id' in self.kwargs:
            teacher_id = self.kwargs["teacher_id"]
            teacher = models.Teacher.objects.get(pk=teacher_id)
            return queryset.filter(course__teacher_id=teacher_id).distinct('id')
            # return models.StudentCourseEnrollment.objects.filter(course__teacher=teacher).distinct('id')
        elif 'student_id' in self.kwargs:
            student_id = self.kwargs["student_id"]
            student = models.Student.objects.get(pk=student_id)
            return queryset.filter(student=student).distinct()
            # return models.StudentCourseEnrollment.objects.filter(student=student).distinct()
            # return models.StudentCourseEnrollment.objects.filter(student=student).distinct('id')
            # qs = models.StudentCourseEnrollment.objects.filter(course__techs__icontains=student.interestedCategories)
            # print(qs.query)
        else:
            return queryset.none()

class EnrollStudentView(APIView):
    def post(self, request, *args, **kwargs):
        student_id = request.data.get('student')
        course_ids = request.data.get('courses', [])
        
        student = models.Student.objects.get(id=student_id)
        courses = models.course.objects.filter(id__in=course_ids)

        for course in courses:
            models.StudentCourseEnrollment.objects.create(student=student, course=course)

        return Response({"message": "Student enrolled in selected courses"}, status=status.HTTP_201_CREATED)

class MyTeachersList(generics.ListAPIView):
    queryset = models.Teacher.objects.all()
    serializer_class = TeacherSerializer

    def get_queryset(self):
        if 'student_id' in self.kwargs:
            student_id = self.kwargs["student_id"]
            return models.Teacher.objects.filter(
                teacher_courses__enrolledCourses__student_id=student_id
            ).distinct()
        return models.Teacher.objects.all()
            # return models.Teacher.objects.filter(
            #     course__studentcourseenrollment__student_id=student_id
            # ).distinct()
        
            # //////////////////////////// below is the original code replaced with ORM /////////////////////////////////////////////
            # sql = f'select id, "fullName" from main_teacher where id in (select teacher_id from main_course where id in (select course_id from main_studentcourseenrollment where student_id={student_id}) group by main_course.teacher_id)'
            # qs = models.Teacher.objects.raw(sql)
            # print(qs)
            # return qs
            # /////////////////////////////////////////////////////////////////////////
            # sql = f'SELECT * from main_course c, main_studentcourseenrollment e, main_teacher t WHERE c.teacher_id=t.id AND e.course_id=c.id AND e.student_id={student_id} GROUP BY c.teacher_id, t.id, c.id, e.id'
            # sql = f'SELECT c."id", c."title", t."id", t."fullName", COUNT(c.teacher_id) as total_courses from main_course c, main_studentcourseenrollment e, main_teacher t WHERE c.teacher_id=t.id AND e.course_id=c.id AND e.student_id={student_id} GROUP BY total_courses'
            # sql = f'select t.*, c.* from main_teacher t, main_course c, main_studentcourseenrollment e where c."teacher_id"=t."id" and e."course_id"=c."id" and e."student_id"={student_id} group by t."id", c."id"' 
            # qs = models.course.objects.filter('teacher_id').values('teacher_id', 'teacher__fullName').annotate(Count('id')).order_by('teacher_id')
            
            # sql = f'SELECT * from main_teacher where id in (SELECT teacher_id from main_course where id in (SELECT course_id from main_studentcourseenrollment where student_id={student_id}))'
        
class CourseRatingList(generics.ListCreateAPIView):
    queryset = models.course.objects.all()
    serializer_class = CourseWithAvgRatingSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = models.course.objects.annotate(
            avg_rating=Avg('courserating__rating')
        )
        if 'popular' in self.request.GET:
            return queryset.order_by('-avg_rating')[:4]

        if 'all' in self.request.GET:
            return queryset.order_by('-avg_rating')

        return queryset

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        # print("--------------->",response.data)  # Debugging statement
        return response
        # //////////////////// original code with ORM above ///////////////////////////
        # if 'popular' in self.request.GET:
        #     # sql = "SELECT *,AVG(cr.rating) as avg_rating FROM main_courserating as cr INNER JOIN main_course as c ON cr.course_id=c.id GROUP BY c.id, cr.id ORDER BY avg_rating desc LIMIT 4"
        #     sql = 'SELECT c."id", c."category_id", c."teacher_id", c."title", c."description", c."featured_img", c."techs", c."course_views", cr."course_id", cr."student_id", cr."rating", cr."reviews", cr."reviewTime", AVG(cr."rating") AS avg_rating FROM main_courserating AS cr INNER JOIN main_course AS c ON cr."course_id"=c."id" GROUP BY c."id", c."category_id", c."teacher_id", c."title", c."description", c."featured_img", c."techs", c."course_views", cr."course_id", cr."student_id", cr."rating", cr."reviews", cr."reviewTime" ORDER BY avg_rating DESC LIMIT 4'
        #     return models.CourseRating.objects.raw(sql)
        # if 'all' in self.request.GET:
        #     # sql = "SELECT *,AVG(cr.rating) as avg_rating FROM main_courserating as cr INNER JOIN main_course as c ON cr.course_id=c.id GROUP BY c.id, cr.id ORDER BY avg_rating desc"
        #     sql = 'SELECT c."id", c."category_id", c."teacher_id", c."title", c."description", c."featured_img", c."techs", c."course_views", cr."course_id", cr."student_id", cr."rating", cr."reviews", cr."reviewTime", AVG(cr."rating") AS avg_rating FROM main_courserating AS cr INNER JOIN main_course AS c ON cr."course_id"=c."id" GROUP BY c."id", c."category_id", c."teacher_id", c."title", c."description", c."featured_img", c."techs", c."course_views", cr."course_id", cr."student_id", cr."rating", cr."reviews", cr."reviewTime" ORDER BY avg_rating DESC'
        #     return models.CourseRating.objects.raw(sql)
        # return models.CourseRating.objects.filter(course__isnull=False).order_by('-rating')
        # /////////////////////////////////////////////////////////////////////////////////

class StudentTestimonialList(generics.ListCreateAPIView):
    queryset = models.CourseRating.objects.all()
    serializer_class = CourseTestimonialSerializer

def fetchRatingStatus(request, student_id, course_id):
    student = models.Student.objects.filter(id=student_id).first()
    course = models.course.objects.filter(id=course_id).first()
    ratingStatus = models.CourseRating.objects.filter(student=student, course=course).count()
    if ratingStatus:
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})

# def get_queryset(self):
#     course_id = self.kwargs["course_id"]
#     course = models.course.objects.get(pk=course_id)
#     return models.CourseRating.objects.filter(course=course)
    
@csrf_exempt
def teacherChangePassword(request, teacher_id):
    password = request.POST['password']
    try:
        teacherData = models.Teacher.objects.get(id=teacher_id)
    except models.Teacher.DoesNotExist:
        teacherData=None
    if teacherData:
        models.Teacher.objects.filter(id=teacher_id).update(password=password)
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})
    
class AssignmentList(generics.ListCreateAPIView):
    queryset = models.StudentAssignment.objects.all()
    serializer_class = StudentAssignmentSerializer

    def get_queryset(self):
        student_id = self.kwargs["student_id"]
        teacher_id = self.kwargs["teacher_id"]
        student = models.Student.objects.get(pk=student_id)
        teacher = models.Teacher.objects.get(pk=teacher_id)
        return models.StudentAssignment.objects.filter(student=student, teacher=teacher)
    
class MyAssignmentsList(generics.ListCreateAPIView):
    queryset = models.StudentAssignment.objects.all()
    serializer_class = StudentAssignmentSerializer

    def get_queryset(self):
        student_id = self.kwargs["studentId"]
        student = models.Student.objects.get(pk=student_id)
        # Update Notification
        models.Notification.objects.filter(student=student, notifFor='student', notifSubject='assignment').update(notifReadStatus=True)
        return models.StudentAssignment.objects.filter(student=student)

class UpdateAssignment(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.StudentAssignment.objects.all()
    serializer_class = StudentAssignmentSerializer

@csrf_exempt
def studentChangePassword(request, student_id):
    password = request.POST['password']
    try:
        studentData = models.Student.objects.get(id=student_id)
    except models.Student.DoesNotExist:
        studentData=None
    if studentData:
        models.Student.objects.filter(id=student_id).update(password=password)
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})

class NotificationList(generics.ListCreateAPIView):
    queryset = models.Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        student = models.Student.objects.get(pk=student_id)
        return models.Notification.objects.filter(student=student, notifFor='student', notifSubject='assignment', notifReadStatus=False)
    
# Quiz
class QuizList(generics.ListCreateAPIView):
    queryset = models.Quiz.objects.all()
    serializer_class = QuizSerializer

# Specific teacher quiz list
class TeacherQuizList(generics.ListCreateAPIView):
    serializer_class = QuizSerializer

    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        teacher = models.Teacher.objects.get(pk=teacher_id)
        return models.Quiz.objects.filter(teacher=teacher)
    
# Specific teacher quiz detail
class TeacherQuizDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Quiz.objects.all()
    serializer_class = QuizSerializer

class QuizDetailview(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Quiz.objects.all()
    serializer_class = QuizSerializer

# Quiz questions
class QuizQuestionsList(generics.ListCreateAPIView):
    queryset = models.QuizQuestions.objects.all()
    serializer_class = QuizQuestionsSerializer

    def get_queryset(self):
        quiz_id = self.kwargs["quiz_id"]
        quiz = models.Quiz.objects.get(pk=quiz_id)
        if 'limit' in self.kwargs:
            return models.QuizQuestions.objects.filter(quiz=quiz).order_by('id')[:1]
        elif 'question_id' in self.kwargs:
            current_question = self.kwargs["question_id"]
            return models.QuizQuestions.objects.filter(quiz=quiz, id__gt=current_question).order_by('id')[:1] 
        else:
            return models.QuizQuestions.objects.filter(quiz=quiz)

# Specific Question
class QuestionDetailview(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.QuizQuestions.objects.all()
    serializer_class = QuizQuestionsSerializer

class CourseQuizList(generics.ListCreateAPIView):
    queryset = models.CourseQuiz.objects.all()
    serializer_class = CourseQuizSerializer

    def get_queryset(self):
        if 'course_id' in self.kwargs:
            course_id = self.kwargs['course_id']
            course = models.course.objects.get(pk=course_id)
            return models.CourseQuiz.objects.filter(course=course)

def fetchQuizAssignStatus(request, quiz_id, course_id):
    quiz = models.Quiz.objects.filter(id=quiz_id).first()
    course = models.course.objects.filter(id=course_id).first()
    assign_status = models.CourseQuiz.objects.filter(course=course, quiz=quiz).count()
    if assign_status:
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})
    
class AttemptQuizList(generics.ListCreateAPIView):
    queryset = models.AttemptQuiz.objects.all()
    serializer_class = AttemptQuizSerializer

    def get_queryset(self):
        if 'quiz_id' in self.kwargs:
            quiz_id = self.kwargs['quiz_id']
            quiz = models.Quiz.objects.get(pk=quiz_id)
            # return models.AttemptQuiz.objects.raw(f'SELECT * FROM main_attemptquiz WHERE quiz_id={int(quiz_id)} GROUP by student_id, quiz_id')
            return models.AttemptQuiz.objects.filter(quiz=quiz)
        
def fetchQuizAttemptStatus(request, quiz_id, student_id):
    quiz = models.Quiz.objects.filter(id=quiz_id).first()
    student = models.Student.objects.filter(id=student_id).first()
    attempt_status = models.AttemptQuiz.objects.filter(student=student, question__quiz=quiz).count()
    if attempt_status > 0:
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})

def fetchQuizResult(request, quiz_id, student_id):
    quiz = models.Quiz.objects.filter(id=quiz_id).first()
    student = models.Student.objects.filter(id=student_id).first()
    total_questions = models.QuizQuestions.objects.filter(quiz=quiz).count()
    total_attempted_questions = models.AttemptQuiz.objects.filter(quiz=quiz, student=student).values('student').count()
    attempted_questions = models.AttemptQuiz.objects.filter(quiz=quiz, student=student)

    total_correct_questions = 0
    for attempt in attempted_questions:
        if attempt.rightAnswer == attempt.question.rightAnswer:
            total_correct_questions += 1

    return JsonResponse({'total_questions':total_questions, 'total_attempted_questions':total_attempted_questions, 'total_correct_questions':total_correct_questions})

# Study Materials List 
class StudyMaterialList(generics.ListCreateAPIView):
    serializer_class = StudyMaterialSerializer

    def get_queryset(self):
        course_id = self.kwargs["course_id"]
        course = models.course.objects.get(pk=course_id)
        return models.StudyMaterial.objects.filter(course=course)

    def list(self, request, *args, **kwargs):
        course_id = self.kwargs["course_id"]
        course = models.course.objects.get(pk=course_id)
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        response_data = {
            'course_title': course.title,
            'study_materials': serializer.data
        }
        return Response(response_data)

class StudyMaterialDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.StudyMaterial.objects.all()
    serializer_class = StudyMaterialSerializer
        
def updateView(request, course_id):
    queryset = models.course.objects.filter(pk=course_id).first()
    queryset.course_views += 1
    queryset.save()
    return JsonResponse({'views': queryset.course_views})

class FaqList(generics.ListAPIView):
    queryset = models.FAQ.objects.all()
    serializer_class = FAQSerializer

class FlatPagesList(generics.ListAPIView):
    queryset = FlatPage.objects.all()
    serializer_class = FlatPageSerializer

class FlatPagesDetail(generics.RetrieveAPIView):
    queryset = FlatPage.objects.all()
    serializer_class = FlatPageSerializer

class ContactList(generics.ListCreateAPIView):
    queryset = models.Contact.objects.all()
    serializer_class = ContactSerializer
    #permission_classes = [permissions.IsAuthenticated]

@csrf_exempt
def teacherForgotPassword(request):
    email = request.POST.get('email')
    verify = models.Teacher.objects.filter(email=email).first()
    if verify:
        link = f"http://localhost:3000/teacher-change-forgot-password/{verify.id}/"
        send_mail(
                "Verify Account",
                "Please verify your account.",
                "irshad.shaikh@gmail.com",
                [email],
                fail_silently=False,
                html_message=f'<p>Your OTP is </p><p>{link}</p>'
                )
        return JsonResponse({'bool':True, 'msg': 'Please check your email!'})
    else:
        return JsonResponse({'bool':False, 'msg': 'Invalid Email address!'})
    
@csrf_exempt
def teacherChangeForgotPassword(request, teacher_id):
    password = request.POST.get('password')
    verify = models.Teacher.objects.filter(id=teacher_id).first()
    if verify:
        models.Teacher.objects.filter(id=teacher_id).update(password=password)
        
        return JsonResponse({'bool':True, 'msg': 'Password has been changed!'})
    else:
        return JsonResponse({'bool':False, 'msg': 'Oops!...Something went wrong! Please try again.'})

@csrf_exempt
def userForgotPassword(request):
    email = request.POST.get('email')
    verify = models.Student.objects.filter(email=email).first()
    if verify:
        link = f"http://localhost:3000/user-change-forgot-password/{verify.id}/"
        send_mail(
                "Verify Account",
                "Please verify your account.",
                "irshad.shaikh@gmail.com",
                [email],
                fail_silently=False,
                html_message=f'<p>Your OTP is </p><p>{link}</p>'
                )
        return JsonResponse({'bool':True, 'msg': 'Please check your email!'})
    else:
        return JsonResponse({'bool':False, 'msg': 'Invalid Email address!'})
    
@csrf_exempt
def userChangeForgotPassword(request, student_id):
    password = request.POST.get('password')
    verify = models.Student.objects.filter(id=student_id).first()
    if verify:
        models.Student.objects.filter(id=student_id).update(password=password)
        
        return JsonResponse({'bool':True, 'msg': 'Password has been changed!'})
    else:
        return JsonResponse({'bool':False, 'msg': 'Oops!...Something went wrong! Please try again.'})
    
@csrf_exempt
def saveTeacherStudentMessage(request, teacher_id, student_id):
    teacher = models.Teacher.objects.get(id=teacher_id)
    student = models.Student.objects.get(id=student_id)
    msgText = request.POST.get('msgText')
    msgFrom = request.POST.get('msgFrom')
    msgRes = models.TeacherStudentChat.objects.create(
        teacher = teacher,
        student = student,
        msgText = msgText,
        msgFrom = msgFrom,
    )
    if msgRes:
        return JsonResponse({'bool':True, 'msg': 'Message sent'})
    else:
        return JsonResponse({'bool':False, 'msg': 'Error! Message could not be sent.'})
    
class MessagesList(generics.ListAPIView):
    queryset = models.TeacherStudentChat.objects.all()
    serializer_class = TeacherStudentChatSerializer
    
    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        student_id = self.kwargs["student_id"]
        teacher = models.Teacher.objects.get(pk=teacher_id)
        student = models.Student.objects.get(pk=student_id)
        return models.TeacherStudentChat.objects.filter(teacher=teacher, student=student).exclude(msgText='')
    
@csrf_exempt
def saveTeacherStudentGroupMessage(request, teacher_id):
    teacher = models.Teacher.objects.get(id=teacher_id)
    msgText = request.POST.get('msgText')
    msgFrom = request.POST.get('msgFrom')

    enrolledList=models.StudentCourseEnrollment.objects.filter(course__teacher=teacher).distinct()
    for enrolled in enrolledList:
        msgRes = models.TeacherStudentChat.objects.create(
        teacher = teacher,
        student = enrolled.student,
        msgText = msgText,
        msgFrom = msgFrom,
    )
    if msgRes:
        return JsonResponse({'bool':True, 'msg': 'Message sent'})
    else:
        return JsonResponse({'bool':False, 'msg': 'Error! Message could not be sent.'})

@csrf_exempt
def saveTeacherStudentGroupMessageFromStudent(request, student_id):
    student = models.Student.objects.get(id=student_id)
    msgText = request.POST.get('msgText')
    msgFrom = request.POST.get('msgFrom')

    # Get the courses in which the student is enrolled
    enrolled_courses = models.StudentCourseEnrollment.objects.filter(student_id=student_id).select_related('course').values_list('course__teacher', flat=True)

    # Now, get the teachers who teach these courses
    teachers = models.Teacher.objects.filter(id__in=enrolled_courses).distinct()

    for teacher in teachers:
        # Send message to each teacher
        msgRes = models.TeacherStudentChat.objects.create(
        teacher = teacher,
        student = student,
        msgText = msgText,
        msgFrom = msgFrom,
    )
    if msgRes:
        return JsonResponse({'bool':True, 'msg': 'Message sent'})
    else:
        return JsonResponse({'bool':False, 'msg': 'Error! Message could not be sent.'})
    
# for online exam --------------------------------------
class TeacherExamListView(APIView):
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request, teacher_id):
        try:
            teacher = models.Teacher.objects.get(pk=teacher_id )
            exams = models.Exam.objects.filter(teacher=teacher).prefetch_related('questions')
            serializer = ExamSerializer(exams, many=True)
            return Response(serializer.data)
        except models.Teacher.DoesNotExist:
            return Response({'error': 'Teacher not found'}, status=404)

class ExamListCreateView(generics.ListCreateAPIView):
    queryset = models.Exam.objects.all()
    serializer_class = ExamSerializer

class ExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Exam.objects.all()
    serializer_class = ExamSerializer

class StudentExamListCreateView(generics.ListCreateAPIView):
    queryset = models.StudentExam.objects.all()
    serializer_class = StudentExamSerializer

class StudentExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.StudentExam.objects.all()
    serializer_class = StudentExamSerializer

class StudentExamsByStudentView(generics.ListAPIView):
    serializer_class = StudentExamSerializer

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        return models.StudentExam.objects.filter(student_id=student_id)

class AvailableExamsForStudentView(APIView):
    def get(self, request, student_id):
        enrollments = models.StudentCourseEnrollment.objects.filter(student_id=student_id).values_list('course_id', flat=True)
        available_exams = models.Exam.objects.filter(course_id__in=enrollments, end_time__gte=timezone.now())
        serializer = ExamSerializer(available_exams, many=True)
        return Response(serializer.data)
    
class AssignExamToStudentView(APIView):
    def post(self, request):
        exam_id = request.data.get('exam_id')
        student_id = request.data.get('student_id')
        course_id = request.data.get('course_id')
        try:
            exam = models.Exam.objects.get(id=exam_id)
            student = models.Student.objects.get(id=student_id)
            course = models.course.objects.get(id=course_id)
            # Check if student is enrolled in the course
            if not models.StudentCourseEnrollment.objects.filter(student=student, course=course).exists():
                return Response({'error': 'Student is not enrolled in the course of the exam'}, status=status.HTTP_400_BAD_REQUEST)
            # Check if the exam is already assigned to the student
            if models.StudentExam.objects.filter(exam=exam, student=student).exists():
                return Response({'error': 'Exam already assigned to the student'}, status=status.HTTP_400_BAD_REQUEST)
            student_exam = models.StudentExam.objects.create(exam=exam, student=student)
            return Response(StudentExamSerializer(student_exam).data, status=status.HTTP_201_CREATED)
        except models.Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)
        except models.Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except models.course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        
# class StudentAssignedExamsView(APIView):
#     def get(self, request, student_id):
#         try:
#             student_exams = models.StudentExam.objects.filter(student_id=student_id)
#             serializer = StudentExamSerializer(student_exams, many=True)
#             response_data = serializer.data

#             for exam_data in response_data:
#                 exam = models.Exam.objects.get(id=exam_data['exam'])
#                 exam_data['end_time'] = exam.end_time

#             return Response(response_data, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StudentAssignedExamsView(APIView):
    def get(self, request, student_id):
        try:
            student_exams = models.StudentExam.objects.filter(student_id=student_id)
            serializer = StudentExamSerializer(student_exams, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StudentExamUpdateView(generics.UpdateAPIView):
    queryset = models.StudentExam.objects.all()
    serializer_class = StudentExamSerializer

class QuestionListCreateView(generics.ListCreateAPIView):
    queryset = models.Question.objects.all()
    serializer_class = QuestionSerializer

    def perform_create(self, serializer):
        exam_id = self.request.data.get('exam')
        exam = models.Exam.objects.get(id=exam_id)
        serializer.save(exam=exam)

class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Question.objects.all()
    serializer_class = QuestionSerializer

# class AnswerListCreateView(generics.ListCreateAPIView):
#     queryset = models.Answer.objects.all()
#     serializer_class = AnswerSerializer

class AnswerListCreateView(generics.ListCreateAPIView):
    serializer_class = AnswerSerializer

    def get_queryset(self):
            student_exam_id = self.request.query_params.get('student_exam')
            if student_exam_id:
                try:
                    student_exam_id = int(student_exam_id)  # Ensure it's an integer
                    return models.Answer.objects.filter(student_exam_id=student_exam_id)
                except ValueError:
                    raise serializers.ValidationError("Invalid student_exam_id")
            return models.Answer.objects.all()

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Answer.objects.all()
    serializer_class = AnswerSerializer

class AnswerListByStudentExamView(APIView):
    def get(self, request, student_exam_id):
        try:
            answers = models.Answer.objects.filter(student_exam_id=student_exam_id)
            serializer = AnswerSerializer(answers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except models.Answer.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class ExamSummaryView(generics.RetrieveAPIView):
    queryset = models.Exam.objects.all()
    serializer_class = ExamSerializer

class AnswerUpdateView(generics.UpdateAPIView):
    queryset = models.Answer.objects.all()
    serializer_class = AnswerSerializer
    # permission_classes = [permissions.IsAuthenticated]

class StartExamView(APIView):
    def post(self, request):
        exam_id = request.data.get('exam_id')
        student_id = request.data.get('student_id')
        try:
            exam = models.Exam.objects.get(id=exam_id)
            student_exam, created = models.StudentExam.objects.get_or_create(
                exam=exam,
                student_id=student_id,
                defaults={'start_time': timezone.now()}
            )
            questions = models.Question.objects.filter(exam=exam)
            questions_serialized = QuestionSerializer(questions, many=True).data
            response_data = StudentExamSerializer(student_exam).data
            response_data['questions'] = questions_serialized
            return Response(response_data, status=status.HTTP_200_OK)
        except models.Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)
        
class SubmitExamView(APIView):
    def post(self, request):
        student_exam_id = request.data.get('student_exam_id')
        try:
            student_exam = models.StudentExam.objects.get(id=student_exam_id)
            student_exam.submitted_time = timezone.now()
            student_exam.save()
            return Response({'status': 'Exam submitted successfully'}, status=status.HTTP_200_OK)
        except models.StudentExam.DoesNotExist:
            return Response({'error': 'Student exam not found'}, status=status.HTTP_404_NOT_FOUND)
# -----------------------------------------------------------------------

# Offline Payment
class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = models.Payment.objects.all()
    serializer_class = PaymentSerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        payment = serializer.save()
        payment.student.update_access()

class CheckAccessView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        student = request.user.student
        if student.has_access():
            return Response({"access": "granted"})
        else:
            return Response({"access": "denied", "message": "Your access has expired. Please make a payment to continue."})

