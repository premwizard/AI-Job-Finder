@echo off
REM Batch file to simulate the make command for Windows without make.exe

if "%~1"=="" goto start
if "%~1"=="start" goto start
if "%~1"=="backend" goto backend
if "%~1"=="frontend" goto frontend

echo Unknown target: %1
echo Available targets: start, backend, frontend
goto :EOF

:start
echo Starting backend and frontend servers...
start cmd /k "cd backend && uvicorn app.server:app --reload"
start cmd /k "cd frontend && npm run dev"
goto :EOF

:backend
echo Starting backend server...
cd backend
uvicorn app.server:app --reload
goto :EOF

:frontend
echo Starting frontend server...
cd frontend
npm run dev
goto :EOF
