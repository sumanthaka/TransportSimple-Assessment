#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py migrate 
echo "from django.contrib.auth.models import User; User.objects.create_superuser('root', 'test@gmail.com', 'root123')" | python3 manage.py shell

# python manage.py collectstatic --no-input --clear

exec "$@"