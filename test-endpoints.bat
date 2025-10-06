@echo off
echo ========================================
echo Testing Mediverse API Endpoints
echo ========================================
echo.

echo [1/4] Testing root /api endpoint...
curl -s https://mediverseai.vercel.app/api
echo.
echo.

echo [2/4] Testing /health endpoint...
curl -s https://mediverseai.vercel.app/health
echo.
echo.

echo [3/4] Testing /api/health endpoint...  
curl -s https://mediverseai.vercel.app/api/health
echo.
echo.

echo [4/4] Testing POST /v1/analyze endpoint...
curl -s -X POST https://mediverseai.vercel.app/v1/analyze -H "Content-Type: application/json" -d "{\"query\":\"test\"}"
echo.
echo.

echo ========================================
echo Test Complete!
echo ========================================
pause
