:: delete old
DEL dist\dcms-ajax.min.js
RD /S /Q dist\css
RD /S /Q dist\images

:: create files // optimize=none
CMD /C r.js.cmd -o bulid.js locale=he-IL out=dist\dcms-ajax.js
MD dist\css
CMD /C r.js.cmd -o cssIn=css\cms.css out=dist\css\cms.min.css
MD dist\images
COPY /Y images dist\images

:: optimize
::type dist\license >> dist\dcms-ajax.min.js
::CScript /nologo bin\pack.wsf dist\dcms-ajax.js >> dist\dcms-ajax.min.js

:: cleanup
::DEL dist\dcms-ajax.js