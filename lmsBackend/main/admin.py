from django.contrib import admin
from . import models

from lmsBackend.accounts.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserModelAdmin(BaseUserAdmin):
  # The fields to be used in displaying the User model.
  # These override the definitions on the base UserModelAdmin
  # that reference specific fields on auth.User.
  list_display = ('id', 'email', 'username', 'usertype', 'tc', 'is_admin')
  list_filter = ('is_admin',)
  fieldsets = (
      ('User Credentials', {'fields': ('email', 'password')}),
      ('Personal info', {'fields': ('username', 'usertype', 'tc')}),
      ('Permissions', {'fields': ('is_admin',)}),
  )
  # add_fieldsets is not a standard ModelAdmin attribute. UserModelAdmin
  # overrides get_fieldsets to use this attribute when creating a user.
  add_fieldsets = (
      (None, {
          'classes': ('wide',),
          'fields': ('email', 'username', 'tc', 'usertype', 'password1', 'password2'),
      }),
  )
  search_fields = ('email',)
  ordering = ('email', 'id')
  filter_horizontal = ()


# Now register the new UserModelAdmin...
admin.site.register(User, UserModelAdmin)

# # admin.site.register(models.UserAccount)
admin.site.register(models.Teacher)
admin.site.register(models.courseCategory)
admin.site.register(models.course)
admin.site.register(models.Chapter)
admin.site.register(models.Student)
admin.site.register(models.StudentCourseEnrollment)
admin.site.register(models.StudentFavouriteCourse)
admin.site.register(models.CourseRating)
admin.site.register(models.StudentAssignment)

class NotificationAdmin(admin.ModelAdmin):
    list_display=['id', 'notifSubject', 'notifFor', 'notifReadStatus']
admin.site.register(models.Notification, NotificationAdmin)

admin.site.register(models.Quiz)
admin.site.register(models.QuizQuestions)
admin.site.register(models.CourseQuiz)
admin.site.register(models.AttemptQuiz)
admin.site.register(models.StudyMaterial)

admin.site.register(models.FAQ)
admin.site.register(models.Contact)
admin.site.register(models.TeacherStudentChat)

admin.site.register(models.Exam)
admin.site.register(models.StudentExam)
admin.site.register(models.Question)
admin.site.register(models.Answer)
admin.site.register(models.Payment)