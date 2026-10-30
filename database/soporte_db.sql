
-- 1. Crear la base de datos solo si no existe
IF DB_ID(N'soporte_db') IS NULL
    CREATE DATABASE soporte_db;
GO

USE soporte_db;
GO

-- 2. Eliminar la tabla si ya existía (permite reiniciar los datos)
IF OBJECT_ID(N'dbo.tickets', N'U') IS NOT NULL
    DROP TABLE dbo.tickets;
GO

-- 3. Crear la tabla tickets
--    IDENTITY(1,1)  -> equivalente a AUTO_INCREMENT de MySQL.
--    NVARCHAR       -> texto Unicode (tildes, ñ).
--    CHECK          -> la BD solo acepta los valores permitidos.
--    DEFAULT        -> valor automático si no se envía el dato.
CREATE TABLE dbo.tickets (
    id            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    asunto        NVARCHAR(150)     NOT NULL,
    solicitante   NVARCHAR(100)     NOT NULL,
    descripcion   NVARCHAR(1000)    NOT NULL,
    categoria     NVARCHAR(30)      NOT NULL
        CONSTRAINT CK_tickets_categoria
        CHECK (categoria IN (N'Hardware', N'Software', N'Red', N'Cuentas y accesos', N'Otro')),
    prioridad     NVARCHAR(10)      NOT NULL
        CONSTRAINT CK_tickets_prioridad
        CHECK (prioridad IN (N'Baja', N'Media', N'Alta', N'Crítica')),
    estado        NVARCHAR(20)      NOT NULL
        CONSTRAINT DF_tickets_estado DEFAULT N'Abierto'
        CONSTRAINT CK_tickets_estado
        CHECK (estado IN (N'Abierto', N'En proceso', N'Resuelto', N'Cerrado')),
    fechaRegistro DATETIME2(0)      NOT NULL
        CONSTRAINT DF_tickets_fecha DEFAULT SYSDATETIME()
);
GO

-- 4. Registros iniciales de ejemplo
--    El prefijo N'' indica texto Unicode.
INSERT INTO dbo.tickets (asunto, solicitante, descripcion, categoria, prioridad, estado, fechaRegistro)
VALUES
(N'Impresora no imprime',          N'María González', N'La impresora del segundo piso muestra el mensaje "atasco de papel" pero no tiene papel atascado.', N'Hardware',          N'Media',   N'Abierto',    DATEADD(DAY, -5, SYSDATETIME())),
(N'Sin acceso al correo',          N'Pedro Soto',     N'No puedo ingresar a mi correo institucional; indica contraseña incorrecta desde esta mañana.',   N'Cuentas y accesos', N'Alta',    N'En proceso', DATEADD(DAY, -3, SYSDATETIME())),
(N'Caída de red en bodega',        N'Luis Fuentes',   N'Los equipos de bodega no tienen conexión a internet ni a la red interna.',                       N'Red',               N'Crítica', N'Abierto',    DATEADD(DAY, -1, SYSDATETIME())),
(N'Instalar Office en notebook',   N'Ana Riquelme',   N'Se requiere instalar el paquete Office en el notebook nuevo del área de ventas.',               N'Software',          N'Baja',    N'Resuelto',   DATEADD(DAY, -8, SYSDATETIME())),
(N'Monitor parpadea',              N'Carla Muñoz',    N'El monitor del puesto 14 parpadea constantemente después de encender el equipo.',               N'Hardware',          N'Media',   N'Cerrado',    DATEADD(DAY, -12, SYSDATETIME()));
GO

-- 5. Comprobación
SELECT * FROM dbo.tickets ORDER BY id;
GO