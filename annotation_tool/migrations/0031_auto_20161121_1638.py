# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-11-21 16:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('annotation_tool', '0030_class_color'),
    ]

    operations = [
        migrations.AlterField(
            model_name='class',
            name='tags',
            field=models.ManyToManyField(blank=True, to='annotation_tool.Tag'),
        ),
    ]
