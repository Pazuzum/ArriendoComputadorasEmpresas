# 📦 Instrucciones para Exportar/Importar Base de Datos

## ⚠️ PROBLEMA: mongodump no está instalado

Para hacer el backup de la base de datos, necesitas instalar MongoDB Database Tools.

---

## 🔧 INSTALAR MONGODB DATABASE TOOLS

1. **Descargar desde:**
   https://www.mongodb.com/try/download/database-tools

2. **Elegir:**
   - Platform: Windows
   - Package: ZIP
   - Version: Latest

3. **Instalar:**
   - Descomprimir el ZIP
   - Copiar todos los archivos .exe a: `C:\Program Files\MongoDB\Server\7.0\bin\`
   - (O agregar la carpeta descomprimida al PATH de Windows)

---

## 📤 EXPORTAR BASE DE DATOS (En tu PC actual)

Una vez instalado, ejecutar en PowerShell:

```powershell
cd d:\ArriendoComputadoras-main\Backend
mongodump --db rentpc --out ./backup-db
```

Esto crea la carpeta `Backend/backup-db` con todos tus datos.

---

## 📥 IMPORTAR BASE DE DATOS (En el otro PC)

1. **Copiar la carpeta** `Backend/backup-db` al otro computador

2. **Ejecutar en PowerShell:**
```powershell
cd ArriendoComputadoras-main\Backend
mongorestore --db rentpc ./backup-db/rentpc
```

---

## 🚀 OPCIÓN ALTERNATIVA: Usar MongoDB Compass (Más Fácil)

Si tienes MongoDB Compass instalado:

1. Abrir MongoDB Compass
2. Conectar a `mongodb://localhost:27017`
3. Click derecho en la base de datos `rentpc`
4. Elegir "Export Collection" para cada colección
5. Guardar los archivos JSON en una carpeta

En el otro PC:
1. Abrir MongoDB Compass
2. Crear base de datos `rentpc`
3. Importar cada archivo JSON a su colección correspondiente

---

## ✅ VERIFICAR QUE FUNCIONÓ

Después de importar, ejecutar:
```powershell
mongosh
use rentpc
db.usuarios.countDocuments()
db.productos.countDocuments()
db.cotizaciones.countDocuments()
```

Deberías ver la cantidad de documentos que tenías originalmente.
