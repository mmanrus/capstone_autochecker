from django.urls import path

from backend.autochecker.views.activity_detail import ActivityDetail
from backend.autochecker.views.auth_views import auto_logout
from backend.autochecker.views.classroom_activities import ClassroomActivities
from backend.autochecker.views.classroom_list import ClassroomListView
from backend.autochecker.views.create_activity import CreateActivityView
from backend.autochecker.views.create_classroom import ClassroomCreateView
from backend.autochecker.views.join_classroom import JoinClassroomView
from backend.autochecker.views.submit_view import SubmitView
from backend.autochecker.views.submitted_activity import SubmittedActivityScoreDetailView
from backend.autochecker.views.unsubmit import UnsubmitView

urlpatterns = [
    path("logout/", auto_logout, name="auto_logout"),
   #!SECTION Activity
    path('classroom/<int:classroom_pk>/makeactivity/', CreateActivityView.as_view(), name="makeactivity"),
    path('classroom/<int:classroom_pk>/activity/<int:pk>', ActivityDetail.as_view(), name='activity_detail'),
    path('classroom/<int:classroom_pk>/activity/<int:pk>/submit/', SubmitView.as_view(), name='submit'),
    path('classroom/<int:classroom_pk>/activity/<int:activity_pk>/submitted/<int:pk>',SubmittedActivityScoreDetailView.as_view(), name='submission_detail'),
    path('submission/<int:pk>/unsubmit/', UnsubmitView.as_view(), name='unsubmit'),
    #!SECTION ClassRoom
    path('classroom/create/', ClassroomCreateView.as_view(),name="create_classroom"),
    path('classroom/join/', JoinClassroomView.as_view(), name="join_classroom"),
    path('', ClassroomListView.as_view(), name='home'),
    path('classroom/<int:pk>/', ClassroomActivities.as_view(), name='classroom_detail')
    
]
