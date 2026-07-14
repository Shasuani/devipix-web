#!/usr/bin/env bash
# DeviPix — preview the site in your default browser. Usage: ./run.sh
# (In VS Code, press F5 / the Run button instead — see .vscode/launch.json.)
cd "$(dirname "$0")"
URL="file://$PWD/index.html"
echo "Opening $URL"
open "$URL"
