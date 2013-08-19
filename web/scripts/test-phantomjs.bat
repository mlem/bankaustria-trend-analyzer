@echo off

REM Windows script for running unit tests
REM You have to run server and capture some browser first
REM
REM Requirements:
REM - NodeJS (http://nodejs.org/)
REM - Karma (npm install -g karma)

REM set CHROME_BIN=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
REM set FIREFOX_BIN=C:\Program Files (x86)\Mozilla Firefox\firefox.exe
REM set IE_BIN=C:\Program Files (x86)\Internet Explorer\iexplore.exe

set BASE_DIR=%~dp0
karma start "%BASE_DIR%\..\config\karma.conf.js" --browsers PhantomJs %*
