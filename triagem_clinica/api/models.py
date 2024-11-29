from django.db import models

class Triagem(models.Model):
    nome = models.CharField(max_length=100)
    idade = models.IntegerField()
    sintomas = models.TextField()

    def __str__(self):
        return self.nome
