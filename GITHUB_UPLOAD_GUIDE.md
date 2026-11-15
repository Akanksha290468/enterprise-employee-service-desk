# Upload this project to GitHub (Windows / VS Code)

1. Create a new **empty** repository on GitHub named `enterprise-employee-service-desk`. Do not add a README or license during creation.
2. Open the extracted project folder in VS Code.
3. Open Terminal → New Terminal. Choose Command Prompt, or use `git` commands in PowerShell.
4. Run these commands one by one from the folder containing `package.json`:

```bat
git init
git add .
git status
git commit -m "Week 3 Employee Service Desk project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/enterprise-employee-service-desk.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username and use the exact repository URL shown by GitHub. If Git asks you to sign in, complete the browser authentication prompt.

**Never upload:** `.env`, `backend/data/service_desk.db`, real employee information, private attachments, passwords, or API secrets. The `.gitignore` file excludes the local environment, database and uploads.

After pushing, open your repository in a browser and verify that README.md, PROJECT_REPORT.md, frontend, backend, database, tests, screenshots and the Postman collection are visible.
