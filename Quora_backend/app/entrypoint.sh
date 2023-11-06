#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST_INTERVIEW $SQL_PORT; do
      sleep 0.1
    done

    while ! nc -z $SQL_HOST_SKILL $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py migrate 
python manage.py collectstatic --no-input --clear

exec "$@"