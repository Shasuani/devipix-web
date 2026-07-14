#!/usr/bin/env bash
# DeviPix — preview the site. Usage: ./run.sh  (add ?debug to URL, or press the ⚙ button)
cd "$(dirname "$0")"
URL="file://$PWD/index.html"
echo "Opening $URL"
open "$URL"
