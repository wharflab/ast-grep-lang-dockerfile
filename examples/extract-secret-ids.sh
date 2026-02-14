#!/bin/bash
# Extract secret IDs from Dockerfile mounts using ast-grep
# Usage: ./extract-secret-ids.sh <dockerfile>
#
# Works with any Dockerfile regardless of extension by using stdin

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

if [ -z "$1" ]; then
    echo "Usage: $0 <dockerfile>" >&2
    exit 1
fi

if [ ! -f "$1" ]; then
    echo "Error: File not found: $1" >&2
    exit 1
fi

# Use stdin to bypass extension-based file matching
cat "$1" | "$ROOT_DIR/node_modules/.bin/sg" scan \
    -c "$ROOT_DIR/sgconfig.yml" \
    -r "$SCRIPT_DIR/find-secrets.yml" \
    --stdin --json 2>/dev/null \
    | jq -r '.[].labels[] | select(.style == "secondary") | .text | select(startswith("id=")) | sub("^id="; "")'
