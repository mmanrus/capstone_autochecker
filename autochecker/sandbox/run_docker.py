import docker
import os
def run_code_in_docker(file_path):
    """Executes the student code inside a Docker container and checks the output"""
    client = docker.from_env()

    try:
        # Expected output for this assignment (can be stored in DB for flexibility)
        expected_output = "Hello world!\n"

        # Run inside Docker
        container = client.containers.run(
            image="python:3.10-slim",
            command=f"python /sandbox/{os.path.basename(file_path)}",
            volumes={os.path.abspath(file_path): {"bind": f"/sandbox/{os.path.basename(file_path)}", "mode": "ro"}},
            remove=True,
            stdout=True,
            stderr=True
        )

        # Compare output with expected
        result = container.decode().strip()
        if result == expected_output.strip():
            return f"😀 Your code passed! Expected: '{expected_output.strip()}', Result: '{result}'\nSee results: https://autochecker.edu"
        else:
            return f"😞 Your code didn't pass. Expected: '{expected_output.strip()}', Result: '{result}'\nSee results: https://autochecker.edu"

    except docker.errors.ContainerError as e:
        return f"❌ Error: {e.stderr.decode()}"
    except Exception as e:
        return f"❌ Unexpected error: {str(e)}"