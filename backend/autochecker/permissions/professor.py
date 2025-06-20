from rest_framework.permissions import BasePermission

class IsProfessor(BasePermission):
     def has_permission(self, request, view):
          return request.user.role == 'professor'