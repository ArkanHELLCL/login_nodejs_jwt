#Login con JWT - NodeJs/JavaScript Vanilla

Proyecto backend con login hecho en nodejs y express.
Utiliza JWT para la segurida de la sesión y de websocket para un chat entre los usuarios conectaodos.
Conexion LDAP para autenticar usuarios

Se deben cerar variables de entor:
DB_HOST = LCASTILLO-PC\MSSQLSERVER19_LC

DB_DATABASE = db_name

//Definimos los datos para login_node_jwt
JWT_SECRETO = jwt_key

//tiempo en el que expira el token
JWT_TIEMPO_EXPIRA = time_in_days

//tiempo en el que expira la cookie
JWT_COOKIE_EXPIRES = time_in_minutes

//LDAP
LDAP_URL = ldap://dominio:puerto
LDAP_URL2 = ldap://ip
LDAP_BASEDN = string_grupos_ldap
LDAP_USUARIO = user
LDAP_PASSWORD = password
LDAP_DOMINIO = @dominio

//HTTPS
PORT = puerto
