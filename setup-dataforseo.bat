@echo off
echo Setting up DataForSEO MCP Server...
echo.

REM Check if environment variables are set
if "%DATAFORSEO_LOGIN%"=="" (
    echo ERROR: DATAFORSEO_LOGIN environment variable is not set!
    echo Please set your DataForSEO credentials:
    echo   set DATAFORSEO_LOGIN=your_email@example.com
    echo   set DATAFORSEO_PASSWORD=your_password
    exit /b 1
)

if "%DATAFORSEO_PASSWORD%"=="" (
    echo ERROR: DATAFORSEO_PASSWORD environment variable is not set!
    echo Please set your DataForSEO credentials:
    echo   set DATAFORSEO_LOGIN=your_email@example.com
    echo   set DATAFORSEO_PASSWORD=your_password
    exit /b 1
)

echo Credentials found:
echo   Login: %DATAFORSEO_LOGIN%
echo   Password: [HIDDEN]
echo.

echo Starting DataForSEO MCP Server...
cd dataforseo-mcp-server
node dataforseo-simple.js

pause