#!/usr/bin/env bash
# Health check for backontrackmeets.com
# Usage: bash scripts/health-check.sh
#
# Checks visible page content only (strips <script>/<style> first) so
# framework internals like Next.js's "$undefined" payload markers do not
# produce false alarms.

set -uo pipefail
BASE="${BASE:-https://www.backontrackmeets.com}"
FAILURES=0

pass() { printf "  \033[32mPASS\033[0m  %s\n" "$1"; }
fail() { printf "  \033[31mFAIL\033[0m  %s\n" "$1"; FAILURES=$((FAILURES + 1)); }

check_status() { # label url expected
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -m 20 "$2")
  if [ "$code" = "$3" ]; then pass "$1 ($code)"; else fail "$1 (got $code, want $3)"; fi
}

echo "Health check: $BASE"
echo
echo "Pages and static files"
check_status "Homepage"          "$BASE/"                 200
check_status "404 page"          "$BASE/__no_such_page__" 404
check_status "robots.txt"        "$BASE/robots.txt"       200
check_status "sitemap.xml"       "$BASE/sitemap.xml"      200
check_status "App icon"          "$BASE/apple-icon.png"   200
check_status "Social share image" "$BASE/opengraph-image" 200

echo
echo "API endpoints"
SHEET="https://docs.google.com/spreadsheets/d/e/2PACX-1vQRT10N_pMLml3pTBoDhvOvta7W4aE_uyhdqasohL6xCWDdu10_5ku3RMAt62rA2Iifx3sLcLeTomgQ/pubhtml"
ESHEET=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$SHEET")
check_status "Site data"              "$BASE/api/data"                         200
check_status "Admin session check"    "$BASE/api/session"                      200
check_status "Results parser"         "$BASE/api/results?url=$ESHEET"          200
check_status "Results SSRF guard"     "$BASE/api/results?url=https://evil.com" 400
check_status "Athlete search"         "$BASE/api/athlete-search?name=a&season=2026" 200
check_status "Calendar (.ics)"        "$BASE/api/calendar?date=July%2028th%202026&time=6:30%20PM" 200
check_status "Cloudinary needs auth"  "$BASE/api/cloudinary-assets"            401

POST_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" -d '{"data":{}}' "$BASE/api/data")
if [ "$POST_CODE" = "401" ]; then
  pass "Saving data requires login (401)"
else
  fail "Saving data NOT protected (got $POST_CODE, want 401)"
fi

echo
echo "Visible page content"
curl -s -m 20 "$BASE/" -o /tmp/_bot_health.html
python3 - <<'PY'
import re, sys
html = open('/tmp/_bot_health.html', encoding='utf-8', errors='replace').read()
# Visible markup = drop scripts/styles (framework payloads live in scripts).
visible = re.sub(r'<script[\s\S]*?</script>', '', html)
visible = re.sub(r'<style[\s\S]*?</style>', '', visible)
text = re.sub(r'<[^>]+>', ' ', visible)
text = re.sub(r'<!--.*?-->', '', text)

green = lambda s: f"  \033[32mPASS\033[0m  {s}"
red   = lambda s: f"  \033[31mFAIL\033[0m  {s}"
failures = 0

expected = ["Back on Track", "Cumberland Valley", "Next Meet", "Schedule", "Sponsors"]
for e in expected:
    if e in text:
        print(green(f"Shows '{e}'"))
    else:
        print(red(f"Missing '{e}'")); failures += 1

# Real problems only: placeholder leftovers and raw JS values in VISIBLE text.
bad = {
    "TBA": "placeholder date",
    "555-0100": "placeholder phone",
    "Community Sponsor": "placeholder sponsor",
    "Season Season": "malformed results tab",
    "object Object": "raw object rendered",
    "NaN": "bad number",
}
for token, why in bad.items():
    if token in text:
        print(red(f"Found '{token}' in visible text ({why})")); failures += 1
    else:
        print(green(f"No '{token}'"))

if re.search(r'\bundefined\b', text):
    print(red("Found 'undefined' in visible text")); failures += 1
else:
    print(green("No 'undefined' in visible text"))

sys.exit(1 if failures else 0)
PY
[ $? -ne 0 ] && FAILURES=$((FAILURES + 1))

echo
if [ "$FAILURES" -eq 0 ]; then
  printf "\033[32mAll checks passed.\033[0m\n"
else
  printf "\033[31m%s check(s) failed.\033[0m\n" "$FAILURES"
  exit 1
fi
