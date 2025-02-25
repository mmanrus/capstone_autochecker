# Use a lightweight base image (Debian-based)
FROM python:3.10-slim

# Create a working directory
WORKDIR /sandbox

# Copy the student's code into the container
COPY student_code.py /sandbox/

# Define the command to run the student's code
CMD ["python", "/sandbox/student_code.py"]
