@echo off
set /p MSG="Commit message: "
if "%MSG%"=="" (
	git add .
	git commit -m "Commited by .bat file"
) else (
	git add .
	git commit -m "%MSG% (from sas-madar)"
)
pause
