# Pull Request Dojo

A hands-on workshop for learning and practicing code reviews on GitHub pull requests.

## What Is This?

This repository contains a small Node.js/Express REST API for managing tasks (a todo list). The **main** branch has clean, well-structured code. A pull request from the **feature/add-task-priority** branch introduces deliberate issues that workshop participants must find and comment on during a review exercise.

The goal is to practice the skills of reading code critically, identifying problems, and giving constructive feedback — the core skills of a good code reviewer.

## Quick Start

### Prerequisites

- Node.js 18 or later
- npm
- A GitHub account
- Git

### Install and Run

```bash
git clone <this-repo-url>
cd pull-request-dojo
npm install
npm start
```

The API starts on `http://localhost:3000`.

### API Endpoints

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | /health            | Health check         |
| GET    | /api/tasks         | List all tasks       |
| GET    | /api/tasks/:id     | Get a single task    |
| POST   | /api/tasks         | Create a new task    |
| PUT    | /api/tasks/:id     | Update a task        |
| DELETE | /api/tasks/:id     | Delete a task        |

### Example Requests

Create a task:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn code reviews", "description": "Practice on the PR Dojo"}'
```

List all tasks:

```bash
curl http://localhost:3000/api/tasks
```

Update a task:

```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

Delete a task:

```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

---

## Workshop Instructions

### For Facilitators

1. **Fork** this repository to your GitHub organization (or personal account).
2. Make sure the `feature/add-task-priority` branch exists in the fork.
3. Create a **Pull Request** from `feature/add-task-priority` into `main`.
   - Title: `Add task priority levels with filtering`
   - Body: see the PR description template below.
4. Share the PR link with participants.
5. Optionally, run the API locally and demonstrate it working so participants have context.

#### PR Description Template

Use this as the body of the pull request:

> **Summary**
>
> Adds a `priority` field to tasks with support for `low`, `medium`, and `high` values.
>
> **Changes**
>
> - Tasks now have a `priority` field (defaults to medium)
> - GET /api/tasks supports `?priority=low|medium|high` query filter
> - PUT /api/tasks/:id can update priority
> - New PATCH endpoint for quick priority changes
> - Added debug endpoint for troubleshooting
> - Enhanced logger to show filtered requests
>
> **Testing**
>
> Tested manually with curl. All endpoints return expected results.

### For Participants

1. Open the Pull Request link your facilitator shared.
2. Read the PR description to understand what the author intended.
3. Click the **Files changed** tab to see the code diff.
4. Review every changed file carefully, line by line.
5. When you find an issue, click the **+** icon on that line to leave an inline comment.
6. When possible, use GitHub's **suggestion** feature to propose exact fixes.
7. After reviewing all files, click **Review changes** (green button, top right).
8. Select **Request changes**, write a summary of your findings, and submit.

---

## PR Review Checklist

Use this checklist as you review. Each item corresponds to a category of feedback:

- [ ] **Naming**: Are variable and function names clear and descriptive?
- [ ] **Security**: Are there any endpoints or code that expose sensitive data?
- [ ] **Error handling**: Are all error cases handled? Are there silent failures?
- [ ] **Code style**: Are there magic numbers or inconsistent formatting?
- [ ] **Performance**: Are there unnecessary operations or redundant computations?
- [ ] **Logic**: Is the logic correct? Are comparisons and conditions right?
- [ ] **Validation**: Are all user inputs validated before use?
- [ ] **Duplication**: Is there copy-pasted code that should be consolidated?
- [ ] **API design**: Are HTTP status codes and response formats consistent?
- [ ] **Readability**: Is the code structured well? Could nesting be reduced?

There are **10 issues** in the pull request. See how many you can find.

---

## How GitHub PR Reviews Work

If you are new to GitHub pull request reviews, here is a quick guide.

### Inline Comments

In the **Files changed** tab, hover over any line number in the diff. A blue **+** icon appears. Click it to open a comment box for that specific line. Write your feedback and click **Add single comment** (posts immediately) or **Start a review** (batches comments until you submit).

### Suggestion Blocks

To propose an exact code change, use the suggestion syntax in your comment:

````
```suggestion
const tasks = taskModel.getAllTasks();
```
````

The PR author will see a button to apply your suggestion with one click, which creates a commit directly from the review.

### Multi-line Comments

Click a line number and drag down to select a range of lines. Your comment will be attached to that entire range. Use this for issues that span multiple lines.

### Submitting Your Review

After leaving inline comments, click the green **Review changes** button in the top right of the Files changed tab. You have three options:

- **Comment**: General observations, no explicit approval or rejection.
- **Approve**: The code looks good to merge.
- **Request changes**: There are issues that must be fixed before merging.

For this workshop, select **Request changes** and write a summary of what you found.

### Review Etiquette Tips

- Be specific: point to the exact line and explain what is wrong.
- Be constructive: suggest a fix, do not just say "this is bad."
- Be kind: assume good intent. Everyone writes imperfect code.
- Distinguish severity: note which issues are blockers vs. minor suggestions.
- Ask questions when unsure: "Should this be validated?" is better than a wrong assumption.

---

## Scoring (Optional)

If running this as a scored exercise:

| Points | Criteria |
|--------|----------|
| 1      | Identified the problem |
| 2      | Explained why it matters |
| 3      | Suggested a specific fix (bonus for using GitHub suggestion blocks) |

There are 10 issues. Maximum score: **30 points**.

### Scoring Tiers

- **25-30**: Excellent reviewer. You catch subtle bugs and give actionable feedback.
- **18-24**: Strong reviewer. You found most issues and explained them well.
- **10-17**: Good start. Focus on reading every line and asking "could this go wrong?"
- **Below 10**: Keep practicing. Review the answer key and study the patterns.

---

## Answer Key (Facilitators Only)

The 10 issues are marked in the feature branch code with comments in this format:

```
// PR-ISSUE #N: [Category] - Description
// WHY: ...
// SUGGESTION: ...
```

Search for `PR-ISSUE` in the feature branch to find all 10. Do not share the answer key with participants until after the exercise.

| # | Category | File | Summary |
|---|----------|------|---------|
| 1 | Naming | src/routes/tasks.js | Variables named d, x, t, ret |
| 2 | Security | src/routes/tasks.js | Debug endpoint exposes process.env |
| 3 | Error Handling | src/routes/tasks.js | Empty catch block, request hangs |
| 4 | Code Style | src/models/task.js | Magic number priorityLevels[2-1] |
| 5 | Performance | src/routes/tasks.js | Unnecessary sort before find-by-ID |
| 6 | Logic Bug | src/models/task.js | > undefined always returns false |
| 7 | Missing Validation | src/routes/tasks.js | Priority not validated on create |
| 8 | Code Duplication | src/routes/tasks.js | PATCH endpoint duplicates PUT logic |
| 9 | API Design | src/routes/tasks.js | DELETE returns 200 instead of 204 |
| 10 | Mentor Opportunity | src/middleware/logger.js | Nested ifs instead of guard clauses |

---

## Project Structure

```
src/
  app.js              Express app setup and server start
  routes/
    tasks.js          CRUD route handlers for /api/tasks
  models/
    task.js           In-memory task store and model logic
  middleware/
    logger.js         HTTP request logger
  utils/
    validators.js     Input validation helper functions
```

## License

Released into the public domain under the [Unlicense](LICENSE).
