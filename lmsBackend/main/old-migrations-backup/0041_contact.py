# Generated by Django 4.2 on 2024-04-03 11:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0040_faq_alter_course_category'),
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
    ]
