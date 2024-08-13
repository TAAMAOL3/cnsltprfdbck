@echo off

del consolutprofeedback_sourcecode.txt

REM Führt das Python-Skript aus
echo Running directory_structure.py.py...
python directory_structure.py.py

REM Erstellt die Build-Dateien für das React-Projekt
echo Running npm start build...
npm run build


REM Startet das React-Projekt
echo Running npm start...
npm start

echo Process completed.
pause
