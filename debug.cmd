:: delete old
DEL public\cms\libs\dcms-ajax.js

:: create files // optimize=none
CMD /C r.js.cmd -o ..\dcms-ajax\bulid.js optimize=none locale=he-IL out=public\cms\libs\dcms-ajax.js