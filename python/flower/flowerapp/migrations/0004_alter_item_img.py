# Generated by Django 5.0.6 on 2024-06-13 13:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flowerapp', '0003_item_img'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='img',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]