from django.urls import path

from autochecker.views.activity_detail import ActivityDetailAPI
from autochecker.views.auth_views import auto_logout
from autochecker.views.classroom_activities import ClassroomActivitiesAPI
from autochecker.views.classroom_list import ClassroomListViewAPI
from autochecker.views.create_activity import CreateActivityViewAPI
from autochecker.views.create_classroom import ClassroomDeleteViewAPI, ClassroomCreateViewAPI
from autochecker.views.join_classroom import JoinClassroomView
from autochecker.views.submit_view import SubmitView
from autochecker.views.submitted_activity import SubmittedActivityScoreDetailView
from autochecker.views.unsubmit import UnsubmitViewAPI

urlpatterns = [
    #path("logout/", auto_logout, name="auto_logout"),
    #!SECTION Activity
    path('classroom/<int:classroom_pk>/makeactivity/', CreateActivityViewAPI.as_view(), name="makeactivity"),
    path('classroom/<int:classroom_pk>/<int:pk>', ActivityDetailAPI.as_view(), name='activity_detail'),
    path('classroom/<int:classroom_pk>/activity/<int:pk>/submit/', SubmitView.as_view(), name='submit'),
    path('classroom/<int:classroom_pk>/activity/<int:activity_pk>/submitted/<int:pk>',SubmittedActivityScoreDetailView.as_view(), name='submission_detail'),
    path('submission/<int:pk>/unsubmit/', UnsubmitViewAPI.as_view(), name='unsubmit'),
    #!SECTION ClassRoom
    path('classroom/create/', ClassroomCreateViewAPI.as_view(),name="create_classroom"),
    path('classroom/delete/<int:pk>/', ClassroomDeleteViewAPI.as_view(), name='delete_classroom'),
    path('classroom/join/', JoinClassroomView.as_view(), name="join_classroom"),
    path('', ClassroomListViewAPI.as_view(), name='home'),
    path('classroom/<int:pk>/', ClassroomActivitiesAPI.as_view(), name='classroom_detail')
    
]
