const sql = require('mssql/msnodesqlv8');

const config = {
  connectionString:
    'Driver={ODBC Driver 18 for SQL Server};' +
    'Server=(localdb)\\MSSQLLocalDB;' +
    'Database=soporte_db;' +
    'Trusted_Connection=yes;' +
    'TrustServerCertificate=yes;',
  options: {
    useUTC: false 
  }
};

const db = new sql.ConnectionPool(config);
const conexion = db.connect();

conexion
  .then(() => console.log('Conectado a SQL Server'))
  .catch((error) => console.error('Error al conectar con SQL Server:', error.message));

module.exports = { db, conexion, sql };