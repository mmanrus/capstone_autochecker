from django.urls import path
from .views import ClassroomListView, SubmitView, CreateActivity, ActivityDetail, ClassroomActivities

urlpatterns = [
   #!SECTION Activity
    path('makeactivity/', CreateActivity.as_view(), name="makeactivity"),
    path('classroom/<int:classroom_pk>/activity/<int:pk>', ActivityDetail.as_view(), name='activity_detail'),
    path('classroom/<int:classroom_pk>/activity/<int:pk>/submit/', SubmitView.as_view(), name='submit'),
    #!SECTION ClassRoom
    path('', ClassroomListView.as_view(), name='home'),
    path('classroom/<int:pk>/', ClassroomActivities.as_view(), name='classroom_detail')
]
