@echo off
echo Testing Mediverse API Endpoints...
echo =====================================
echo.

echo Test 1: Health Endpoint
curl -s https://mediverseai.vercel.app/api/health
echo.
echo.

echo Test 2: Root Endpoint
curl -s https://mediverseai.vercel.app/api/
echo.
echo.

echo Test 3: POST Analyze (should work if endpoints are up)
curl -s -X POST https://mediverseai.vercel.app/api/v1/analyze -F "query=test" -F "mode=quick"
echo.
echo.

echo =====================================
echo Tests Complete!
pause
