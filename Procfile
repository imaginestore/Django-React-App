web: gunicorn lmsBackend.lms_api.wsgi --log-file -
web: python manage.py migrate && gunicorn lmsBackend.lms_api.wsgi