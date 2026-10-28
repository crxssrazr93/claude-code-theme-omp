#!/bin/sh
set -eu
here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
mkdir -p "$HOME/.omp/agent/themes"
cp "$here"/themes/claude-code-*.json "$HOME/.omp/agent/themes/"
omp config set theme.dark claude-code-dark
omp config set theme.light claude-code-light
omp plugin link "$here/extension"
echo "installed; start a new omp session"
