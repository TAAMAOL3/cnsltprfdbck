@echo off

del consolutprofeedback_sourcecode.txt

REM Führt das Python-Skript aus
echo Running directory_structure.py.py...
python directory_structure.py.py

REM Führt den Build-Prozess und startet die App
echo Building and starting the app...
npm run build && npm start

echo Process completed.
pause
