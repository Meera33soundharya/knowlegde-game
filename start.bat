@echo off
echo Starting Student Study Hub...
echo.

echo Installing dependencies...
call npm install
cd server
call npm install
cd ..

echo.
echo Starting servers...
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:4000
echo.

start "Backend Server" cmd /k "cd server && npm start"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Close this window when you're done studying!
pause