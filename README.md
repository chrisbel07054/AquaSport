# AquaSport - Plataforma de Torneos Acuáticos

## Estudiantes
- **Alumna 1:** Luisiana Valeria Carreño Viloria
- **CI:** 31.728.880
- **Alumna 2:** Chrisbel Alexandra Briceño Briceño
- **CI:** 31.665.592
- **Alumno 3:** Gustavo Andrés Méndez
- **CI:** 30.860.474
- **Materia:** Front End II
- **Profesor:** Yerson González

## Descripción
AquaSport es una aplicación web progresiva (PWA) desarrollada para la gestión de torneos de natación y deportes acuáticos. La plataforma permite a los usuarios registrarse, inscribirse en torneos, ver información detallada de eventos deportivos y compartir testimonios sobre su experiencia. Cuenta con un sistema de autenticación que protege las rutas mediante roles (admin y participante) utilizando tokens JWT.

## Base de Datos
Este proyecto utiliza **MySQL** como sistema de gestión de base de datos, junto con **Sequelize** como ORM para la interacción con la base de datos.

## Credenciales de Prueba
- **Admin**: 
  - Email: admin@example.com
  - Contraseña: 123456


## Prueba de la PWA
Para probar la funcionalidad de PWA, siga estos pasos:
1. Asegúrese de que el backend esté en ejecución
2. Verifique que la base de datos MySQL esté activa
3. En la consola del frontend, ejecute:
   ```bash
   npm run build
   npm run preview