# 🧩 Working on a Task (Contributing Guide)

This guide explains the steps for contributing to this project, especially for teammates using [Taiga](https://taiga.io/).

---

## ✅ 1. Set Task to In Progress

> Go to **Taiga** and move the task/story status to `In Progress`.
> Pohun ig naa tay project management tool gigamit
> Wala ta ani

---

## ✅ 2. Prepare Your Local Git Environment

 install here > <https://git-scm.com/downloads>

> Make sure you're working off the latest `develop` branch.

and also Make sure you are at the project Directory

```bash
# Switch to the develop branch
     git checkout develop

# Fetch latest changes
     git fetch 

# Rebase your local develop to match the remote
     git rebase origin/develop

# Create a new feature branch
     git checkout -b {TASK_NAME}-short-description
     example: git checkout -b create-form-input-on-login
```

## ✅ 3. Commit Your Work

``` bash
     git add .
     git commit -m "Create: form input for login"
```

## ✅ 4. Push and Create a Pull Request (PR)

``` bash
     git push origin HEAD
```

After pushing:
Copy the link printed in the terminal.
     Go to that URL and create a pull request into the develop branch.
     ✅ Make sure your PR is targeting develop (not main or master)
     📝 Include a meaningful title and description of what your PR does.
