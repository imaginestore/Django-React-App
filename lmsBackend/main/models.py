from django.db import models
from django.db.models import Q
from django.core import serializers
from django.core.mail import send_mail
from django_ckeditor_5.fields import CKEditor5Field
from lmsBackend.accounts.models import User
from django.utils import timezone
from datetime import timedelta

# Teacher model
class Teacher(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    fullName = models.CharField(max_length=100, blank=False, null=False)
    detail = models.TextField(null=True, blank=True)    # default=""
    qualification = models.CharField(max_length=200, blank=False, null=False)
    skills = models.CharField(max_length=200, blank=True, null=True)    # default=""
    dateOfBirth = models.DateField(blank=False, null=False)
    gender = models.CharField(max_length=10, blank=False, null=False)
    mobileNo = models.CharField(max_length=20, blank=False, null=False)
    # email = models.EmailField(max_length=100)
    profile_img = models.ImageField(upload_to='teacher_profile_imgs/', null=True, blank=True)
    # password = models.CharField(max_length=100, null=True, blank=True)
    address = models.TextField(blank=False, null=False)
    cityTown = models.CharField(max_length=100, blank=False, null=False)
    country = models.CharField(max_length=100, blank=False, null=False)
    verify_status = models.BooleanField(blank=True, null=True, default=False)
    otp_digits = models.CharField(max_length=10, null=True, blank=True)
    login_via_otp = models.BooleanField(null=True, blank=True, default=False)
    facebookURL = models.URLField(null=True, blank=True)
    twitterURL = models.URLField(null=True, blank=True)
    instagramURL = models.URLField(null=True, blank=True)
    websiteURL = models.URLField(null=True, blank=True)
  

    class Meta:
        verbose_name_plural = "1. Teachers"

    def __str__(self):
        return self.fullName

    def skills_list(self):
        skills_list = self.skills.split(',')
        return skills_list

    def names(self):
        names = self.fullName.split()
        return names[0]
    
    # Total Teacher Courses
    def totalTeacherCourses(self):
        totalCourses = course.objects.filter(teacher=self).count()
        return totalCourses
    
    # Total Teacher Chapters
    def totalTeacherChapters(self):
        totalChapters = Chapter.objects.filter(course__teacher=self).count()
        return totalChapters
    
    # Total Teacher Students
    def totalTeacherStudents(self):
        totalStudents = StudentCourseEnrollment.objects.filter(course__teacher=self).count()
        return totalStudents
    
    # def save(self):
    #     send_mail(
    #         "Verify Account",
    #         "Please verify your account.",
    #         "irshad.shaikh@gmail.com",
    #         [self.email],
    #         fail_silently=False,
    #         html_message=f'<p>Your OTP is </p><p>{self.otp_digits}</p>'
    #         )
    #     return super().save()


# Course category model
class courseCategory(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()

    class Meta:
        verbose_name_plural = "2. Course categories"

    # Total courses of this category
    def total_courses(self):
        return course.objects.filter(category=self).count()

    def __str__(self):
        return self.title

# Course model
class course(models.Model):
    category = models.ForeignKey(courseCategory, on_delete=models.CASCADE, related_name='category_courses')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='teacher_courses')
    title = models.CharField(max_length=150)
    description = models.TextField()
    featured_img = models.ImageField(upload_to='course_imgs/', null=True)
    techs = models.TextField(null=True)
    course_views = models.BigIntegerField(default=0)

    class Meta:
        verbose_name_plural = "3. Courses"

    def tech_list(self):
        # tech_list = self.techs.split(',')
        tech_list = [tech.strip() for tech in self.techs.split(',')]
        return tech_list
    
    def related_videos(self):
        related_videos = course.objects.filter(techs__icontains=self.techs)
        return serializers.serialize('json', related_videos)
    
    # def get_related_courses(self):
    #     techs = self.tech_list()
    #     related_courses = course.objects.filter(techs__icontains=self.techs).exclude(id=self.id)
    #     return related_courses

    def related_subjects(self):
        if self.techs:
            techs_list = [tech.strip() for tech in self.techs.split(',')]
            q_objects = Q()
            for tech in techs_list:
                q_objects |= Q(techs__icontains=tech)
            
            related_subjects = course.objects.filter(
                category=self.category
            ).filter(q_objects).exclude(id=self.id)
            # print("Related Subjects:", related_subjects)  # Debugging line
            return related_subjects
        return course.objects.none()

    def totalEnrolledStudents(self):
        totalEnrolledStudents = StudentCourseEnrollment.objects.filter(course=self).count()
        return totalEnrolledStudents

    def courseRating(self):
        courseRating = CourseRating.objects.filter(course=self).aggregate(avgRating=models.Avg('rating'))
        return courseRating['avgRating']
    
    def __str__(self):
        return self.title

    

# Chapter model
class Chapter(models.Model):
    course = models.ForeignKey(course, on_delete=models.CASCADE, related_name="course_chapters")
    title = models.CharField(max_length=150)
    description = models.TextField(null=True, blank=True)
    video = models.FileField(upload_to='chapter_videos/', null=True, blank=True)
    content=CKEditor5Field('Text', config_name='extends', null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "4. Chapters"

# Student model
class Student(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    fullName = models.CharField(max_length=100, blank=False, null=False)
    gender = models.CharField(max_length=10, blank=False, null=False)
    mobileNo = models.CharField(max_length=100, blank=False, null=False, default=0)
    profile_img = models.ImageField(upload_to='student_profile_imgs/', null=True, blank=True)
    interestedCategories = models.TextField(null=True, blank=True)
    verify_status = models.BooleanField(blank=True, null=True, default=False)
    otp_digits = models.CharField(max_length=10, null=True, blank=True)
    login_via_otp = models.BooleanField(null=True, blank=True, default=False)
    access_until = models.DateTimeField(null=True, blank=True)

    # Total Enrolled Courses
    def enrolledCourses(self):
        enrolledCourses = StudentCourseEnrollment.objects.filter(student=self).count()
        return enrolledCourses
    
    # Total Favourite Courses
    def favouriteCourses(self):
        favouriteCourses = StudentFavouriteCourse.objects.filter(student=self).count()
        return favouriteCourses
    
    # Completed Assignments
    def completeAssignments(self):
        completeAssignments = StudentAssignment.objects.filter(student=self, assignmentStatus=True).count()
        return completeAssignments
    
    # Pending Assignments
    def pendingAssignments(self):
        pendingAssignments = StudentAssignment.objects.filter(student=self, assignmentStatus=False).count()
        return pendingAssignments
    
    # Return first name
    def names(self):
        names = self.fullName.split()
        return names[0]
    
    # Update access until date when a new payment is made
    def update_access(self):
        last_payment = self.payments.order_by('-payment_date').first()
        if last_payment:
            self.access_until = last_payment.payment_date + timedelta(days=30*last_payment.months_paid)
            self.save()

    # Check if student has access
    def has_access(self):
        return self.access_until and self.access_until > timezone.now()

    class Meta:
        verbose_name_plural = "5. Students"

    def __str__(self):
        return self.fullName
    
# Student Course Enrollment
class StudentCourseEnrollment(models.Model):
    course = models.ForeignKey(course, on_delete=models.CASCADE, related_name='enrolledCourses')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrolledStudents')
    enrolledTime = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "6. Enrolled Courses"

    def __str__(self):
        return f"{self.course}: {self.student}"
    
# Student Favourite Course
class StudentFavouriteCourse(models.Model):
    course = models.ForeignKey(course, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "7. Student's Favourite Courses"
    
    def __str__(self):
        return f"{self.course}: {self.student}"

# Course Rating and Reviews
class CourseRating(models.Model):
    course = models.ForeignKey(course, on_delete=models.CASCADE, null=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
    rating = models.PositiveBigIntegerField(default=0)
    reviews = models.TextField(null=True)
    reviewTime = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "8. Courses Rating"

    def __str__(self):
        return f"{self.course}: {self.student}, {self.rating}"
    
# Student Assignment
class StudentAssignment(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=200)
    detail = models.TextField(null=True)
    assignmentStatus = models.BooleanField(default=False, null=True)
    addTime = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "9. Student's Assignments"

    def __str__(self):
        return self.title

# Notification
class Notification(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    notifSubject = models.CharField(max_length=200, verbose_name='Notification Subject')
    notifFor = models.CharField(max_length=200, verbose_name='Notification For')
    notifCreatedTime = models.DateTimeField(auto_now_add=True)
    notifReadStatus = models.BooleanField(default=False, verbose_name='Notification Status')

    class Meta:
        verbose_name_plural = "10. Notifications"

# Quiz Model
class Quiz(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=200)
    detail = models.TextField()
    creationTime = models.DateTimeField(auto_now_add=True)

    def assignStatus(self):
        return CourseQuiz.objects.filter(quiz=self).count()

    class Meta:
        verbose_name_plural = "11. Quiz"

    def __str__(self):
        return f"{self.title}: {self.teacher}"     

# Quiz Questions Model
class QuizQuestions(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, null=True)
    question = models.CharField(max_length=200)
    answer1 = models.CharField(max_length=200)
    answer2 = models.CharField(max_length=200)
    answer3 = models.CharField(max_length=200)
    answer4 = models.CharField(max_length=200)
    rightAnswer = models.CharField(max_length=200)
    creationTime = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "12. Quiz Questions" 

    def __str__(self):
        return f"{self.quiz}"     


# Add Quiz to Course
class CourseQuiz(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    course = models.ForeignKey(course, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    quizAddedTime = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "13. Course Quiz"

    def __str__(self):
        return f"{self.course}: {self.quiz} by {self.teacher}"  

# Quiz questions attempted by a student
class AttemptQuiz(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    question = models.ForeignKey(QuizQuestions, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, null=True)
    rightAnswer = models.CharField(max_length=200, null=True)
    attemptedTime = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "14. Attempted Questions"

    def __str__(self):
        return f"Quiz - {self.quiz} attempted by: {self.student}"

# Study Materials Model
class StudyMaterial(models.Model):
    course = models.ForeignKey(course, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    description = models.TextField()
    upload = models.FileField(upload_to='study_materials/', null=True)
    remarks = models.TextField(null=True)

    class Meta:
        verbose_name_plural = "15. Course Study Materials"

    def __str__(self):
        return f"{self.course}: {self.title}"

# FAQ Model
class FAQ(models.Model):
    question = models.CharField(max_length=300)
    answer = models.TextField()

    class Meta:
        verbose_name_plural = "16. FAQs"

    def __str__(self):
        return f"{self.question}"

# Contact Us Model
class Contact(models.Model):
    fullName = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    queryText = models.TextField()
    queryTime = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "17. Contact Queries"

    def __str__(self) -> str:
        return self.queryText
    
    def save(self, *args, **kwargs):
        send_mail(
            "Contact Query",
            "Here is the message.",
            "irshad.shaikh@gmail.com",
            [self.email],
            fail_silently=False,
            html_message=f'<p>{self.fullName}</p><p>{self.queryText}</p>'
            )
        return super(Contact, self).save(*args, **kwargs)

# Messages
class TeacherStudentChat(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    msgText = models.TextField()
    msgFrom = models.CharField(max_length=100)
    msgTime = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "18. Teacher Student Messages"

    def __str__(self):
        return f"From teacher: {self.teacher}, To student: {self.student}"
    
# Online exam models --------------------------------------------------------------------
# Exam model
class Exam(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='exams')
    course = models.ForeignKey(course, on_delete=models.CASCADE, related_name='course_exams', null=True)
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    
    class Meta:
        verbose_name_plural = "19. Exams"

    def __str__(self):
        return self.title
    
    def is_active(self):
        now = timezone.now()
        return self.start_time <= now <= self.end_time

# StudentExam model
class StudentExam(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='student_exams')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='exams_taken')
    start_time = models.DateTimeField(auto_now_add=True)
    submitted_time = models.DateTimeField(null=True, blank=True)
    is_graded = models.BooleanField(default=False)  # Add is_graded field

    class Meta:
        verbose_name_plural = "20. Student Exams"

    def __str__(self):
        return f"{self.exam.title} - {self.student.fullName}"

    @property
    def total_marks(self):
        return self.student_answers.aggregate(total_marks=models.Sum('marks'))['total_marks'] or 0
    
# Question model
class Question(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()

    class Meta:
        verbose_name_plural = "21. Question"

    def __str__(self):
        return self.text

# Answer model
class Answer(models.Model):
    student_exam = models.ForeignKey(StudentExam, on_delete=models.CASCADE, related_name='student_answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='question_answers')
    answer_text = models.TextField()
    marks = models.FloatField(default=0.0)  # Add marks field
    feedback = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "22. Answer"

    def __str__(self):
        # unique_together = ('student', 'exam')
        return f"{self.student_exam.student}: {self.question}"
    
# Offline payment 
class Payment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    months_paid = models.IntegerField(default=1)  # Number of months access is granted

    class Meta:
        verbose_name_plural = "23. Payments"

    def __str__(self):
        return f"{self.student.fullName} - {self.amount} - {self.payment_date}"

