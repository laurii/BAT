# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-12-13 17:12
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('annotation_tool', '0043_auto_20161209_1111'),
    ]

    operations = [
        migrations.AddField(
            model_name='class',
            name='project',
            field=models.ForeignKey(default=5, on_delete=django.db.models.deletion.CASCADE, to='annotation_tool.Project'),
            preserve_default=False,
        ),
    ]