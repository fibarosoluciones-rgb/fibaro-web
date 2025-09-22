
-- Extendido: clientes, comerciales, productos, tarifas, precontratos, referidos, comisiones
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

create table if not exists clientes (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  nombre text,
  telefono text,
  nif text,
  direccion text,
  created_at timestamptz default now()
);

create table if not exists comerciales (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  email text unique not null,
  telefono text,
  objetivo_mensual int default 0,
  comision_base numeric default 0,
  activo boolean default true,
  created_at timestamptz default now()
);

create table if not exists operadores (
  id serial primary key,
  nombre text unique not null check (nombre in ('masmovil','pepephone','simyo','jazztel'))
);

insert into operadores (nombre)
values ('masmovil'),('pepephone'),('simyo'),('jazztel')
on conflict do nothing;

create table if not exists tarifas (
  id uuid primary key default uuid_generate_v4(),
  operador_id int references operadores(id) on delete restrict,
  plan text not null,
  precio numeric not null,
  velocidad_down int,
  velocidad_up int,
  datos int,
  minutos int,
  permanencia_meses int default 0,
  vigente boolean default true,
  created_at timestamptz default now()
);

create table if not exists productos (
  id uuid primary key default uuid_generate_v4(),
  sku text unique,
  nombre text not null,
  descripcion text,
  precio numeric not null,
  stock int default 0,
  activo boolean default true,
  created_at timestamptz default now()
);

create table if not exists pedidos (
  id uuid primary key default uuid_generate_v4(),
  cliente_id uuid references clientes(id) on delete set null,
  total numeric not null,
  estado text default 'pendiente',
  created_at timestamptz default now()
);

create table if not exists pedido_items (
  id uuid primary key default uuid_generate_v4(),
  pedido_id uuid references pedidos(id) on delete cascade,
  producto_id uuid references productos(id) on delete set null,
  cantidad int not null,
  precio_unitario numeric not null
);

create table if not exists precontratos (
  id uuid primary key default uuid_generate_v4(),
  cliente_id uuid references clientes(id) on delete set null,
  comercial_id uuid references comerciales(id) on delete set null,
  tarifa_id uuid references tarifas(id) on delete set null,
  estado text default 'nuevo',
  notas text,
  created_at timestamptz default now()
);

create table if not exists referidos (
  id uuid primary key default uuid_generate_v4(),
  cliente_id uuid references clientes(id) on delete cascade,
  referido_email text not null,
  recompensa numeric default 0,
  estado text default 'pendiente',
  created_at timestamptz default now()
);

create table if not exists cartera (
  cliente_id uuid primary key references clientes(id) on delete cascade,
  saldo numeric default 0,
  updated_at timestamptz default now()
);

create table if not exists cartera_movs (
  id uuid primary key default uuid_generate_v4(),
  cliente_id uuid references clientes(id) on delete cascade,
  concepto text,
  importe numeric not null,
  created_at timestamptz default now()
);

create index if not exists idx_precontratos_estado on precontratos(estado);
create index if not exists idx_tarifas_vigente on tarifas(vigente);
create index if not exists idx_pedidos_cliente on pedidos(cliente_id);
