# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-11-11 10:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('annotation_tool', '0024_wav_file'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wav',
            name='abs_path',
        ),
        migrations.AlterField(
            model_name='wav',
            name='file',
            field=models.FileField(max_length=500, upload_to='/home/bmelendez/musicspeech_annotation_project/django_test/'),
        ),
    ]
