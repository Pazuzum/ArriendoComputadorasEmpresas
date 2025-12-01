# 🖥️ INSTRUCCIONES PARA PRESENTAR EN OTRO PC

## 📦 REQUISITOS PREVIOS

Antes de ir a presentar, asegúrate de tener instalado en el **otro PC**:

1. **Node.js** (v18 o superior)
   - Descargar: https://nodejs.org/

2. **MongoDB Community Edition** + **MongoDB Database Tools**
   - MongoDB: https://www.mongodb.com/try/download/community
   - Database Tools: https://www.mongodb.com/try/download/database-tools

3. **Git** (opcional, si vas a clonar desde GitHub)
   - Descargar: https://git-scm.com/

---

## 🚀 PASOS EN EL OTRO PC

### **OPCIÓN A: Clonar desde GitHub** (Recomendado)

1. **Abrir PowerShell o CMD**

2. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Pazuzum/ArriendoComputadorasEmpresas.git
   cd ArriendoComputadorasEmpresas
   ```

3. **Instalar dependencias del Backend:**
   ```bash
   cd Backend
   npm install
   ```

4. **Instalar dependencias del Frontend:**
   ```bash
   cd ..\rentpc
   npm install
   ```

5. **Importar la base de datos:**
   ```bash
   cd ..\Backend
   importar-db.bat
   ```
   (O si usas PowerShell: `.\importar-db.ps1`)

6. **Iniciar el proyecto:**
   - **Terminal 1 - Backend:**
     ```bash
     cd Backend
     npm run dev
     ```
   
   - **Terminal 2 - Frontend:**
     ```bash
     cd rentpc
     npm run dev
     ```

7. **Abrir el navegador:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

---

### **OPCIÓN B: Copiar carpeta desde USB**

1. **Copiar** toda la carpeta `ArriendoComputadoras-main` del USB al PC

2. **Abrir PowerShell en la carpeta copiada**

3. **Instalar dependencias:**
   ```bash
   cd Backend
   npm install
   
   cd ..\rentpc
   npm install
   ```

4. **Importar base de datos:**
   ```bash
   cd ..\Backend
   importar-db.bat
   ```

5. **Iniciar proyecto** (igual que la Opción A, paso 6)

---

## ✅ VERIFICAR QUE TODO FUNCIONA

Después de importar la base de datos, verifica:

```bash
mongosh
use rentpc
db.usuarios.countDocuments()
db.productos.countDocuments()
db.cotizaciones.countDocuments()
```

Deberías ver números mayores a 0.

---

## 🔑 CREDENCIALES DE ACCESO

### **Cuenta Admin:**
- Email: admin@rentpc.com
- Contraseña: admin123

### **Cuenta Usuario de Prueba:**
- Email: (la que creaste durante las pruebas)
- Contraseña: (la que asignaste)

---

## ⚠️ TROUBLESHOOTING

### Si MongoDB no arranca:
```bash
# Verificar si está corriendo
mongosh

# Iniciar el servicio manualmente (Windows)
net start MongoDB
```

### Si `mongoimport` no se reconoce:
- Asegúrate de haber instalado **MongoDB Database Tools**
- Agregar al PATH: `C:\Program Files\MongoDB\Tools\100\bin\`

### Si hay problemas con npm:
```bash
# Limpiar caché
npm cache clean --force
npm install
```

---

## 📞 CONTACTO DE EMERGENCIA

Si algo falla el día de la presentación:
1. Revisar que MongoDB esté corriendo
2. Verificar que ambos terminales (Backend y Frontend) estén activos
3. Revisar logs en las terminales para ver errores específicos

---

## ✨ CARACTERÍSTICAS PRINCIPALES PARA MOSTRAR

1. **Registro de empresas** (requiere aprobación admin)
2. **Catálogo de productos** con carrito de cotización
3. **Sistema de reservas** con contrato PDF y firma digital
4. **Panel de administración** para gestionar usuarios y cotizaciones
5. **Notificaciones toast** en tiempo real
6. **Validaciones** de stock y fechas

¡Buena suerte con la presentación! 🎉
