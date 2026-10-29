const express = require('express');
const cors = require('cors');
const { db, conexion, sql } = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    mensaje: 'API Soporte Técnico funcionando'
  });
});

// Listar todos los tickets
app.get('/api/tickets', async (req, res) => {
  try {
    await conexion;
    const resultado = await db.request()
      .query('SELECT * FROM tickets ORDER BY id DESC');

    res.status(200).json(resultado.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al consultar los tickets' });
  }
});

// Obtener un ticket por su id
app.get('/api/tickets/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    await conexion;
    const resultado = await db.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM tickets WHERE id = @id');

    if (resultado.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }

    res.status(200).json(resultado.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al consultar el ticket' });
  }
});

// Registrar un ticket
app.post('/api/tickets', async (req, res) => {
  const { asunto, solicitante, descripcion, categoria, prioridad, estado } = req.body;

  if (!asunto || !solicitante || !descripcion || !categoria || !prioridad) {
    return res.status(400).json({
      mensaje: 'Complete todos los campos obligatorios'
    });
  }

  try {
    await conexion;
    const resultado = await db.request()
      .input('asunto', sql.NVarChar, asunto.trim())
      .input('solicitante', sql.NVarChar, solicitante.trim())
      .input('descripcion', sql.NVarChar, descripcion.trim())
      .input('categoria', sql.NVarChar, categoria)
      .input('prioridad', sql.NVarChar, prioridad)
      .input('estado', sql.NVarChar, estado || 'Abierto')
      .query(`
        INSERT INTO tickets (asunto, solicitante, descripcion, categoria, prioridad, estado)
        OUTPUT INSERTED.*
        VALUES (@asunto, @solicitante, @descripcion, @categoria, @prioridad, @estado)
      `);

    res.status(201).json(resultado.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el ticket' });
  }
});

// Actualizar un ticket
app.put('/api/tickets/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { asunto, solicitante, descripcion, categoria, prioridad, estado } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  if (!asunto || !solicitante || !descripcion || !categoria || !prioridad || !estado) {
    return res.status(400).json({
      mensaje: 'Complete todos los campos obligatorios'
    });
  }

  try {
    await conexion;
    const resultado = await db.request()
      .input('id', sql.Int, id)
      .input('asunto', sql.NVarChar, asunto.trim())
      .input('solicitante', sql.NVarChar, solicitante.trim())
      .input('descripcion', sql.NVarChar, descripcion.trim())
      .input('categoria', sql.NVarChar, categoria)
      .input('prioridad', sql.NVarChar, prioridad)
      .input('estado', sql.NVarChar, estado)
      .query(`
        UPDATE tickets
        SET asunto = @asunto, solicitante = @solicitante, descripcion = @descripcion,
            categoria = @categoria, prioridad = @prioridad, estado = @estado
        WHERE id = @id
      `);

    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }

    res.status(200).json({ mensaje: 'Ticket actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el ticket' });
  }
});

// Eliminar un ticket
app.delete('/api/tickets/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    await conexion;
    const resultado = await db.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM tickets WHERE id = @id');

    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }

    res.status(200).json({ mensaje: 'Ticket eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el ticket' });
  }
});

app.listen(PORT, () => {
  console.log(`API ejecutándose en http://localhost:${PORT}`);
});