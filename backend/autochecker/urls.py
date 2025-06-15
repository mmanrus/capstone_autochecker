from django.urls import path

from autochecker.views.activity_detail import ActivityDetail
from autochecker.views.auth_views import auto_logout
from autochecker.views.classroom_activities import ClassroomActivities
from autochecker.views.classroom_list import ClassroomListView
from autochecker.views.create_activity import CreateActivityView
from autochecker.views.create_classroom import ClassroomCreateView, ClassroomDelete, ClassroomCreate
from autochecker.views.join_classroom import JoinClassroomView
from autochecker.views.submit_view import SubmitView
from autochecker.views.submitted_activity import SubmittedActivityScoreDetailView
from autochecker.views.unsubmit import UnsubmitView

urlpatterns = [
    path("logout/", auto_logout, name="auto_logout"),
   #!SECTION Activity
    path('classroom/<int:classroom_pk>/makeactivity/', CreateActivityView.as_view(), name="makeactivity"),
    path('classroom/<int:classroom_pk>/activity/<int:pk>', ActivityDetail.as_view(), name='activity_detail'),
    path('classroom/<int:classroom_pk>/activity/<int:pk>/submit/', SubmitView.as_view(), name='submit'),
    path('classroom/<int:classroom_pk>/activity/<int:activity_pk>/submitted/<int:pk>',SubmittedActivityScoreDetailView.as_view(), name='submission_detail'),
    path('submission/<int:pk>/unsubmit/', UnsubmitView.as_view(), name='unsubmit'),
    #!SECTION ClassRoom
    path('classroom/create/', ClassroomCreate.as_view(),name="create_classroom"),
    path('classroom/delete/', ClassroomDelete.as_view(), name='delete_classroom'),
    path('classroom/join/', JoinClassroomView.as_view(), name="join_classroom"),
    path('', ClassroomListView.as_view(), name='home'),
    path('classroom/<int:pk>/', ClassroomActivities.as_view(), name='classroom_detail')
    
]
