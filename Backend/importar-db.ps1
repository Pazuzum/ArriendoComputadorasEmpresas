# Script PowerShell para importar la base de datos

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " IMPORTAR BASE DE DATOS - RENTPC" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Ir a la carpeta del script
Set-Location $PSScriptRoot

Write-Host "[1/5] Importando usuarios..." -ForegroundColor Yellow
mongoimport --db rentpc --collection usuarios --file backup-db\rentpc-db.usuarios.json --jsonArray
Write-Host ""

Write-Host "[2/5] Importando productos..." -ForegroundColor Yellow
mongoimport --db rentpc --collection productos --file backup-db\rentpc-db.productos.json --jsonArray
Write-Host ""

Write-Host "[3/5] Importando cotizaciones..." -ForegroundColor Yellow
mongoimport --db rentpc --collection cotizacions --file backup-db\rentpc-db.cotizacions.json --jsonArray
Write-Host ""

Write-Host "[4/5] Importando reservas..." -ForegroundColor Yellow
mongoimport --db rentpc --collection reservas --file backup-db\rentpc-db.reservas.json --jsonArray
Write-Host ""

Write-Host "[5/5] Importando roles..." -ForegroundColor Yellow
mongoimport --db rentpc --collection rols --file backup-db\rentpc-db.rols.json --jsonArray
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host " IMPORTACION COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Verificar importación
Write-Host "Verificando datos importados..." -ForegroundColor Cyan
mongosh --quiet --eval "use rentpc; print('Usuarios: ' + db.usuarios.countDocuments()); print('Productos: ' + db.productos.countDocuments()); print('Cotizaciones: ' + db.cotizacions.countDocuments()); print('Reservas: ' + db.reservas.countDocuments()); print('Roles: ' + db.rols.countDocuments());"

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
