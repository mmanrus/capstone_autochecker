from django.urls import path
from .views import auto_logout,ClassroomCreateView ,ClassroomListView, JoinClassroomView, SubmitView, UnsubmitView,SubmittedActivityScoreDetailView, CreateActivityView, ActivityDetail, ClassroomActivities

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
