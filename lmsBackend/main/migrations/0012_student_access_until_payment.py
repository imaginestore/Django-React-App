# Generated by Django 4.2 on 2024-07-14 18:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0011_alter_studentexam_student'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='access_until',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('payment_date', models.DateTimeField(auto_now_add=True)),
                ('months_paid', models.IntegerField(default=1)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to='main.student')),
            ],
            options={
                'verbose_name_plural': '23. Payments',
            },
        ),
    ]
