@echo off
echo ========================================
echo  IMPORTAR BASE DE DATOS - RENTPC
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Importando usuarios...
mongoimport --db rentpc --collection usuarios --file backup-db\rentpc-db.usuarios.json --jsonArray
echo.

echo [2/5] Importando productos...
mongoimport --db rentpc --collection productos --file backup-db\rentpc-db.productos.json --jsonArray
echo.

echo [3/5] Importando cotizaciones...
mongoimport --db rentpc --collection cotizacions --file backup-db\rentpc-db.cotizacions.json --jsonArray
echo.

echo [4/5] Importando reservas...
mongoimport --db rentpc --collection reservas --file backup-db\rentpc-db.reservas.json --jsonArray
echo.

echo [5/5] Importando roles...
mongoimport --db rentpc --collection rols --file backup-db\rentpc-db.rols.json --jsonArray
echo.

echo ========================================
echo  IMPORTACION COMPLETADA
echo ========================================
echo.
echo Presiona cualquier tecla para salir...
pause >

