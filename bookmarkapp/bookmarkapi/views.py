from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from .models import Bookmark
from .serializers import BookmarkSerializer


# @api_view(['GET'])
# def getData(request):
#     items = Bookmark.objects.all()
#     serializer = BookmarkSerializer(items, many=True)
#     return Response(serializer.data)
#
#
# @api_view(['POST'])
# def addBookmark(request):
#     serializer = BookmarkSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#     return Response(serializer.data)
#
#
# @api_view(['DELETE'])
# def deleteBookmark(request, pk):
#     try:
#         bookmark = Bookmark.objects.get(id=pk)
#     except:
#         return Response({"error": "Bookmark not found"}, status=404)
#
#     bookmark.delete()
#     return Response({"message": "Bookmark deleted successfully"}, status=204)
#
# class BookmarkListView(ListAPIView):
#     queryset = Bookmark.objects.all()
#     serializer_class = BookmarkSerializer
#
# class BookmarkDetailView(RetrieveAPIView):
#         queryset = Bookmark.objects.all()
#         serializer_class = BookmarkSerializer
#
# class BookmarkCreateView(CreateAPIView):
#     queryset = Bookmark.objects.all()
#     serializer_class = BookmarkSerializer
#
# class BookmarkDeleteView(DestroyAPIView):
#     queryset = Bookmark.objects.all()
#     serializer_class = BookmarkSerializer
#
# class BookmarkUpdateView(UpdateAPIView):
#     queryset = Bookmark.objects.all()
#     serializer_class = BookmarkSerializer
from rest_framework import viewsets
class BookmarkViewSet(viewsets.ModelViewSet):
    serializer_class = BookmarkSerializer
    queryset = Bookmark.objects.all()