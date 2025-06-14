from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import os
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from .models import Activity, Submission, Classroom
from .forms import SubmitForm, ActivityCreationForm, ClassroomCodeForm, CreateClassroomForm
from django.views.generic import CreateView, View, DetailView, ListView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView
from django.contrib.auth import get_user_model, logout
import logging
from django.db.models import OuterRef, Subquery, Exists, Value, BooleanField
from datetime import datetime

from django.dispatch import receiver
from django.utils.timezone import now
import pytz
import socket
from django.views.decorators.http import require_POST





# Join Classroomclass 
