#!/usr/bin/env bash
set -euo pipefail

# ─── Configuration ───────────────────────────────────────────────────────────
declare -A AUTHORS=(
  ["kallash04"]="lisi.ciko@gmail.com"
  ["erblinboletini"]="erblinboletini@gmail.com"
  ["deni921"]="denimekollari921@gmail.com"
)

MESSAGES=(
  "feat: implement doctor availability endpoints"
  "fix: correct slot generation logic"
  "refactor: extract availability service"
  "docs: update API docs for appointments"
  "test: add integration tests for booking"
  "chore: bump dependencies"
  "perf: optimize database queries for schedule"
  "feat: add history log endpoint"
  "fix: resolve timezone issue in appointments"
  "chore: update README with setup instructions"
  "feat: integrate Bedrock AI classification"
  "refactor: reorganize controllers directory"
  "docs: document new availability routes"
)

START_DATE="2025-04-08"
END_DATE="$(date '+%Y-%m-%d')"
LOG_FILE="activity.log"

# Ensure activity.log exists
if [[ ! -f $LOG_FILE ]]; then
  echo "# Activity Log" > "$LOG_FILE"
  git add "$LOG_FILE"
  git commit --allow-empty -m "chore: initialize activity log"
fi

# Advance date helper
advance_date() {
  date -I -d "$1 + $2 days"
}

# Main loop: step by random 3–5 days
current_date="$START_DATE"
while [[ "$current_date" < "$END_DATE" ]]; do
  for author in "${!AUTHORS[@]}"; do
    count=$(( RANDOM % 3 + 1 ))  # 1–3 commits
    for ((i=0; i<count; i++)); do
      hh=$(printf "%02d" $(( RANDOM % 8 + 9 )))   # 09–16h
      mm=$(printf "%02d" $(( RANDOM % 60 )))
      ss=$(printf "%02d" $(( RANDOM % 60 )))
      timestamp="${current_date}T${hh}:${mm}:${ss}"

      export GIT_AUTHOR_NAME="$author"
      export GIT_AUTHOR_EMAIL="${AUTHORS[$author]}"
      export GIT_COMMITTER_NAME="$author"
      export GIT_COMMITTER_EMAIL="${AUTHORS[$author]}"
      export GIT_AUTHOR_DATE="$timestamp"
      export GIT_COMMITTER_DATE="$timestamp"

      msg="${MESSAGES[RANDOM % ${#MESSAGES[@]}]}"
      echo "+ $msg" >> "$LOG_FILE"
      git add "$LOG_FILE"
      git commit --allow-empty -m "$msg"
    done
  done

  # jump ahead 3–5 days
  step=$(( RANDOM % 3 + 3 ))  # yields 3,4,5
  current_date=$(advance_date "$current_date" $step)
done

echo "✅ Fake commits (every 3–5 days) from $START_DATE to $END_DATE generated."
