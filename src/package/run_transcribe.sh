#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

LOG_FILE="$SCRIPT_DIR/logs/transcribe_log${date}.txt"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "Script started at $(date)"
echo "Script directory: $SCRIPT_DIR"

echo "Activating virtual environment"
source "$SCRIPT_DIR/.venv/bin/activate"


echo "Running Python script with argument: $1"
python3 "$SCRIPT_DIR/transcribe.py" "$1"

echo "Script finished at $(date)"