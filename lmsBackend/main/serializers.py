from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from . import models
from accounts.models import User
from django.contrib.flatpages.models import FlatPage
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class TeacherSerializer(serializers.ModelSerializer):
    total_courses = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Teacher
        fields = ['id', 'user', 'fullName', 'detail', 'qualification', 'skills', 'dateOfBirth', 'gender', 'mobileNo', 'profile_img', 'address', 'cityTown', 'country', 'teacher_courses', 'skills_list', 'totalTeacherCourses', 'totalTeacherChapters', 'totalTeacherStudents', 'otp_digits', 'login_via_otp', 'facebookURL', 'twitterURL', 'instagramURL', 'websiteURL', 'names', 'total_courses']

    def __init__(self, *args, **kwargs):
        super(TeacherSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 1

    def get_total_courses(self, obj):
        return obj.total_courses if hasattr(obj, 'total_courses') else 0

    # def update(self, instance, validated_data):
    #     logger.debug(f"Validated data before update: {validated_data}")
    #     # Remove 'user' from validated_data if present
    #     validated_data.pop('user', None)

    #     # Update other fields
    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)
        
    #     instance.save()
    #     logger.debug(f"Instance after update: {instance}")
    #     return instance

    # def create(self, validate_data):
    #     email = self.validated_data['email']
    #     otp_digits = self.validated_data['otp_digits']
    #     instance = super(TeacherSerializer, self).create(validate_data)
    #     send_mail(
    #         "Verify Account",
    #         "Please verify your account.",
    #         "irshad.shaikh@gmail.com",
    #         [email],
    #         fail_silently=False,
    #         html_message=f'<p>Your OTP is </p><p>{otp_digits}</p>'
    #         )
    #     return instance

# class AdminDashboardSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.Teacher
#         fields = ['totalTeachers', 'totalStudents', 'totalCourses', 'totalChapters', 'totalExams', 'totalQuizzes']

class AdminDashboardSerializer(serializers.Serializer):
    totalTeachers = serializers.IntegerField()
    totalStudents = serializers.IntegerField()
    totalCourses = serializers.IntegerField()
    totalChapters = serializers.IntegerField()
    totalExams = serializers.IntegerField()
    totalQuizzes = serializers.IntegerField()

class TeacherDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Teacher
        fields = ['totalTeacherCourses', 'totalTeacherChapters', 'totalTeacherStudents']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.courseCategory
        fields = ['id', 'title', 'description', 'total_courses']

class RelatedCourseSerializer(serializers.ModelSerializer):
    featured_img = serializers.SerializerMethodField()
    class Meta:
        model = models.course
        fields = ['id', 'title', 'featured_img', 'category']

    def get_featured_img(self, obj):
        request = self.context.get('request', None)
        if request is not None and obj.featured_img:
            return request.build_absolute_uri(obj.featured_img.url)
        elif obj.featured_img:
            return settings.MEDIA_URL + obj.featured_img.name
        return None

class courseSerializer(serializers.ModelSerializer):
    related_subjects = serializers.SerializerMethodField()
    class Meta:
        model = models.course
        fields = ['id', 'category', 'teacher', 'title', 'description', 'featured_img', 'techs', 'course_views', 'course_chapters', 'related_videos', 'related_subjects', 'tech_list', 'totalEnrolledStudents', 'courseRating']
    
    def __init__(self, *args, **kwargs):
        super(courseSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 1
    
    def get_related_subjects(self, obj):
        related_courses = obj.related_subjects()
        # print("related_courses----->", related_courses)
        return RelatedCourseSerializer(related_courses, many=True, context=self.context).data
    
    # def get_related_courses(self, obj):
    #     related_courses = obj.get_related_courses()
    #     return courseSerializer(related_courses, many=True).data

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Chapter
        fields = ['id', 'course', 'title', 'description', 'video', 'content', 'remarks']

    def __init__(self, *args, **kwargs):
        super(ChapterSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 1

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Student
        fields = ['id', 'user', 'fullName', 'gender', 'mobileNo', 'profile_img', 'interestedCategories', 'otp_digits', 'login_via_otp', 'names']

    def __init__(self, *args, **kwargs):
        super(StudentSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 1

    # def create(self, validate_data):
    #     email = self.validated_data['email']
    #     otp_digits = self.validated_data['otp_digits']
    #     instance = super(StudentSerializer, self).create(validate_data)
    #     send_mail(
    #         "Verify Account",
    #         "Please verify your account.",
    #         "irshad.shaikh@gmail.com",
    #         [email],
    #         fail_silently=False,
    #         html_message=f'<p>Your OTP is </p><p>{otp_digits}</p>'
    #         )
    #     return instance

class StudentCourseEnrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudentCourseEnrollment
        fields = ['id', 'course', 'student', 'enrolledTime']

    def __init__(self, *args, **kwargs):
        super(StudentCourseEnrollSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 2

class StudentFavouriteCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudentFavouriteCourse
        fields = ['id', 'course', 'student', 'status']

    def __init__(self, *args, **kwargs):
        super(StudentFavouriteCourseSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 2

class CourseRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CourseRating
        fields = ['id', 'course', 'student', 'rating', 'reviews', 'reviewTime']
        
    def __init__(self, *args, **kwargs):
        super(CourseRatingSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 2

class CourseWithAvgRatingSerializer(serializers.ModelSerializer):
    avg_rating = serializers.FloatField()
    category = CategorySerializer()

    class Meta:
        model = models.course
        fields = ['id', 'category', 'teacher', 'title', 'description', 'featured_img', 'techs', 'course_views', 'avg_rating']

class CourseTestimonialSerializer(serializers.ModelSerializer):
    student = StudentSerializer()
    course = courseSerializer()

    class Meta:
        model = models.CourseRating
        fields = ['id', 'course', 'student', 'rating', 'reviews', 'reviewTime']

class StudentAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudentAssignment
        fields = ['id','teacher', 'student', 'title', 'detail', 'assignmentStatus', 'addTime']
    
    def __init__(self, *args, **kwargs):
        super(StudentAssignmentSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 2

class StudentDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Student
        fields = ['enrolledCourses', 'favouriteCourses', 'completeAssignments', 'pendingAssignments']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Notification
        fields = ['teacher', 'student', 'notifSubject', 'notifFor', 'notifCreatedTime', 'notifReadStatus']

class QuizSerializer(serializers.ModelSerializer):
    total_questions = serializers.SerializerMethodField()
    class Meta:
        model = models.Quiz
        fields = ['id', 'teacher', 'title', 'detail', 'creationTime', 'assignStatus', 'total_questions']
    
    def __init__(self, *args, **kwargs):
        super(QuizSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 2

    def get_total_questions(self, obj):
        return models.QuizQuestions.objects.filter(quiz=obj).count()

class QuizQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.QuizQuestions
        fields = ['id', 'quiz', 'question', 'answer1', 'answer2', 'answer3', 'answer4', 'rightAnswer', 'creationTime']

    def __init__(self, *args, **kwargs):
        super(QuizQuestionsSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 1
   
class CourseQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CourseQuiz
        fields = ['id', 'teacher', 'course', 'quiz', 'quizAddedTime']

    def __init__(self, *args, **kwargs):
        super(CourseQuizSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 2

class AttemptQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AttemptQuiz
        fields = ['id', 'student', 'question', 'quiz', 'rightAnswer', 'attemptedTime']

    def __init__(self, *args, **kwargs):
        super(AttemptQuizSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 2

class StudyMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudyMaterial
        fields = ['id', 'course', 'title', 'description', 'upload', 'remarks']

    def __init__(self, *args, **kwargs):
        super(StudyMaterialSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 2

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FAQ
        fields = ['id', 'question', 'answer']

class FlatPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlatPage
        fields = ['id', 'title', 'content', 'url']

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Contact
        fields = ['id', 'fullName', 'email', 'queryText', 'queryTime']

class TeacherStudentChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeacherStudentChat
        fields = ['id', 'teacher', 'student', 'msgText', 'msgFrom', 'msgTime']

    def formatDate(self, instance):
        formattedDate = super(TeacherDashboardSerializer, self).formatDate(instance)
        formattedDate['msgTime'] = instance.msgTime.strftime("%Y-%m-%d %H:%M")
        return formattedDate
    
# for online exam --------------------------------------------------
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Question
        fields = ['id', 'exam', 'text']

class AnswerSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    
    class Meta:
        model = models.Answer
        fields = ['id', 'student_exam', 'question', 'answer_text', 'marks', 'feedback']

class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = models.Exam
        fields = ['id', 'teacher', 'course', 'title', 'description', 'start_time', 'end_time', 'questions']

class StudentExamSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True, source='student_answers')
    total_marks = serializers.ReadOnlyField()
    exam = ExamSerializer(read_only=True)  # Nested ExamSerializer

    class Meta:
        model = models.StudentExam
        fields = ['id', 'student', 'exam', 'start_time', 'submitted_time', 'is_graded', 'total_marks', 'answers']

# ------------------------------------------------------------------
# Payment
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Payment
        fields = ['id', 'student', 'amount', 'payment_date', 'months_paid']