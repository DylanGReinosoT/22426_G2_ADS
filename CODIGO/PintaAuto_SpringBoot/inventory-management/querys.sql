--Agrega las columnas manualmente permitiendo valores nulos temporalmente:
ALTER TABLE materia_prima ADD COLUMN created_at timestamp(6);
ALTER TABLE materia_prima ADD COLUMN detalles varchar(255);
--Actualiza los valores nulos existentes:
UPDATE materia_prima SET created_at = NOW() WHERE created_at IS NULL;
UPDATE materia_prima SET detalles = 'Sin detalles' WHERE detalles IS NULL;
--Haz las columnas NOT NULL:
ALTER TABLE materia_prima ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE materia_prima ALTER COLUMN detalles SET NOT NULL;

--Para la parte de fechas
--Agrega la columna permitiendo nulos
ALTER TABLE materia_prima ADD COLUMN fecha_ingreso timestamp(6);
--Actualiza los registros existentes con un valor por defecto:
UPDATE materia_prima SET fecha_ingreso = NOW() WHERE fecha_ingreso IS NULL;
--Haz la columna NOT NULL:
ALTER TABLE materia_prima ALTER COLUMN fecha_ingreso SET NOT NULL;



-- Para materia_prima
ALTER TABLE materia_prima ADD COLUMN IF NOT EXISTS updated_at timestamp(6);
UPDATE materia_prima SET updated_at = NOW() WHERE updated_at IS NULL;
ALTER TABLE materia_prima ALTER COLUMN updated_at SET NOT NULL;

-- Para usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS created_at timestamp(6);
UPDATE usuarios SET created_at = NOW() WHERE created_at IS NULL;
ALTER TABLE usuarios ALTER COLUMN created_at SET NOT NULL;

-- 1. Agrega la columna permitiendo nulos
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS updated_at timestamp(6);

-- 2. Actualiza los registros existentes con un valor por defecto
UPDATE usuarios SET updated_at = NOW() WHERE updated_at IS NULL;

-- 3. Haz la columna NOT NULL
ALTER TABLE usuarios ALTER COLUMN updated_at SET NOT NULL;

--73ac7c5e-de77-47ad-ba12-e4a1b96e1e1c