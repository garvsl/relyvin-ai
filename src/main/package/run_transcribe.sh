#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

LOG_FILE="$SCRIPT_DIR/logs/transcribe_log$(date +%Y%m%d_%H%M%S).txt"
mkdir -p "$(dirname "$LOG_FILE")"

{
    echo "Script started at $(date)"
    echo "Script directory: $SCRIPT_DIR"

    echo "Activating virtual environment"
    if [ -f "$SCRIPT_DIR/.venv/bin/activate" ]; then
        source "$SCRIPT_DIR/.venv/bin/activate"
        echo "Virtual environment activated successfully"
    else
        echo "Error: Virtual environment activation script not found"
        exit 1
    fi

    echo "Running Python script with argument: $1"
    python3 "$SCRIPT_DIR/transcribe.py" "$1"

    echo "Script finished at $(date)"
} 2>&1 | tee -a "$LOG_FILE"