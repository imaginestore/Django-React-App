# Generated by Django 4.2 on 2024-06-08 11:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_ckeditor_5.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fullName', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=100)),
                ('queryText', models.TextField()),
                ('queryTime', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name_plural': '17. Contact Queries',
            },
        ),
        migrations.CreateModel(
            name='course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150)),
                ('description', models.TextField()),
                ('featured_img', models.ImageField(null=True, upload_to='course_imgs/')),
                ('techs', models.TextField(null=True)),
                ('course_views', models.BigIntegerField(default=0)),
            ],
            options={
                'verbose_name_plural': '3. Courses',
            },
        ),
        migrations.CreateModel(
            name='courseCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150)),
                ('description', models.TextField()),
            ],
            options={
                'verbose_name_plural': '2. Course categories',
            },
        ),
        migrations.CreateModel(
            name='FAQ',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=300)),
                ('answer', models.TextField()),
            ],
            options={
                'verbose_name_plural': '16. FAQs',
            },
        ),
        migrations.CreateModel(
            name='Quiz',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('detail', models.TextField()),
                ('creationTime', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name_plural': '11. Quiz',
            },
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fullName', models.CharField(max_length=100)),
                ('gender', models.CharField(max_length=10)),
                ('profile_img', models.ImageField(null=True, upload_to='student_profile_imgs/')),
                ('interestedCategories', models.TextField()),
                ('verify_status', models.BooleanField(default=False)),
                ('otp_digits', models.CharField(max_length=10, null=True)),
                ('login_via_otp', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': '5. Students',
            },
        ),
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fullName', models.CharField(max_length=100)),
                ('detail', models.TextField(blank=True, null=True)),
                ('qualification', models.CharField(max_length=200)),
                ('skills', models.CharField(max_length=200)),
                ('dateOfBirth', models.DateField()),
                ('gender', models.CharField(max_length=10)),
                ('mobileNo', models.CharField(max_length=20)),
                ('profile_img', models.ImageField(null=True, upload_to='teacher_profile_imgs/')),
                ('address', models.TextField()),
                ('cityTown', models.CharField(max_length=100)),
                ('country', models.CharField(max_length=100)),
                ('verify_status', models.BooleanField(default=False)),
                ('otp_digits', models.CharField(max_length=10, null=True)),
                ('login_via_otp', models.BooleanField(default=False)),
                ('facebookURL', models.URLField(null=True)),
                ('twitterURL', models.URLField(null=True)),
                ('instagramURL', models.URLField(null=True)),
                ('websiteURL', models.URLField(null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': '1. Teachers',
            },
        ),
        migrations.CreateModel(
            name='TeacherStudentChat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('msgText', models.TextField()),
                ('msgFrom', models.CharField(max_length=100)),
                ('msgTime', models.DateTimeField(auto_now_add=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.student')),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.teacher')),
            ],
            options={
                'verbose_name_plural': '18. Teacher Student Messages',
            },
        ),
        migrations.CreateModel(
            name='StudyMaterial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150)),
                ('description', models.TextField()),
                ('upload', models.FileField(null=True, upload_to='study_materials/')),
                ('remarks', models.TextField(null=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.course')),
            ],
            options={
                'verbose_name_plural': '15. Course Study Materials',
            },
        ),
        migrations.CreateModel(
            name='StudentFavouriteCourse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.BooleanField(default=False)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.course')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.student')),
            ],
            options={
                'verbose_name_plural': "7. Student's Favourite Courses",
            },
        ),
        migrations.CreateModel(
            name='StudentCourseEnrollment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('enrolledTime', models.DateTimeField(auto_now_add=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrolledCourses', to='main.course')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrolledStudents', to='main.student')),
            ],
            options={
                'verbose_name_plural': '6. Enrolled Courses',
            },
        ),
        migrations.CreateModel(
            name='StudentAssignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('detail', models.TextField(null=True)),
                ('assignmentStatus', models.BooleanField(default=False, null=True)),
                ('addTime', models.DateTimeField(auto_now_add=True)),
                ('student', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='main.student')),
                ('teacher', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='main.teacher')),
            ],
            options={
                'verbose_name_plural': "9. Student's Assignments",
            },
        ),
        migrations.CreateModel(
            name='QuizQuestions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=200)),
                ('answer1', models.CharField(max_length=200)),
                ('answer2', models.CharField(max_length=200)),
                ('answer3', models.CharField(max_length=200)),
                ('answer4', models.CharField(max_length=200)),
                ('rightAnswer', models.CharField(max_length=200)),
                ('creationTime', models.DateTimeField(auto_now_add=True)),
                ('quiz', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='main.quiz')),
            ],
            options={
                'verbose_name_plural': '12. Quiz Questions',
            },
        ),
        migrations.AddField(
            model_name='quiz',
            name='teacher',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='main.teacher'),
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notifSubject', models.CharField(max_length=200, verbose_name='Notification Subject')),
                ('notifFor', models.CharField(max_length=200, verbose_name='Notification For')),
                ('notifCreatedTime', models.DateTimeField(auto_now_add=True)),
                ('notifReadStatus', models.BooleanField(default=False, verbose_name='Notification Status')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.student')),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.teacher')),
            ],
            options={
                'verbose_name_plural': '10. Notifications',
            },
        ),
        migrations.CreateModel(
            name='CourseRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.PositiveBigIntegerField(default=0)),
                ('reviews', models.TextField(null=True)),
                ('reviewTime', models.DateTimeField(auto_now_add=True)),
                ('course', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='main.course')),
                ('student', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='main.student')),
            ],
            options={
                'verbose_name_plural': '8. Courses Rating',
            },
        ),
        migrations.CreateModel(
            name='CourseQuiz',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quizAddedTime', models.DateTimeField(auto_now_add=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.course')),
                ('quiz', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.quiz')),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.teacher')),
            ],
            options={
                'verbose_name_plural': '13. Course Quiz',
            },
        ),
        migrations.AddField(
            model_name='course',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='category_courses', to='main.coursecategory'),
        ),
        migrations.AddField(
            model_name='course',
            name='teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='teacher_courses', to='main.teacher'),
        ),
        migrations.CreateModel(
            name='Chapter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150)),
                ('description', models.TextField()),
                ('video', models.FileField(null=True, upload_to='chapter_videos/')),
                ('content', django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True, verbose_name='Text')),
                ('remarks', models.TextField(null=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='course_chapters', to='main.course')),
            ],
            options={
                'verbose_name_plural': '4. Chapters',
            },
        ),
        migrations.CreateModel(
            name='AttemptQuiz',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rightAnswer', models.CharField(max_length=200, null=True)),
                ('attemptedTime', models.DateTimeField(auto_now_add=True)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.quizquestions')),
                ('quiz', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='main.quiz')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.student')),
            ],
            options={
                'verbose_name_plural': '14. Attempted Questions',
            },
        ),
    ]
