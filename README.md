Backend para Gestión de Carteras de Inversión

Este proyecto es el backend para una aplicación de gestión de carteras de inversión, proporcionando funcionalidades clave para gestionar activos financieros como acciones y criptomonedas.

Características Principales

	•	Autenticación: Sistema de autenticación seguro usando JWT.
	•	Gestión de Inversiones: Permite agregar, eliminar y consultar inversiones en acciones y criptomonedas.
	•	APIs Externas: Integración con APIs como Finnhub y Alpha Vantage para obtener datos de mercado en tiempo real.
	•	Generación Automática de Informes: Informe diario personalizado sobre el estado de la cartera de inversión, con análisis generados por OpenAI.
	•	Optimización y Seguridad: Uso de bcrypt para encriptación de contraseñas y dotenv para manejar variables de entorno sensibles.
	•	Manejo de Errores: Sistema centralizado de manejo de errores para respuestas claras al cliente.

Dependencias

	•	express: Framework para el servidor web.
	•	jsonwebtoken: Para la autenticación mediante tokens JWT.
	•	bcryptjs: Encriptación de contraseñas.
	•	typeorm: ORM para la interacción con la base de datos.
	•	pg: Driver para PostgreSQL.
	•	express-validator: Middleware para validación de datos.
	•	axios: Cliente HTTP para hacer peticiones a APIs externas.
	•	dotenv: Manejo de variables de entorno desde un archivo .env.
	•	winston: Librería para la gestión de logs.
