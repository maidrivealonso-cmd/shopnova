import React, { useMemo, useState } from 'react';

const productos = [
  { id: 1, nombre: 'Camiseta básica algodón', precio: 75000, color: 'Blanco', descripcion: 'Camiseta básica de algodón, cómoda para el uso diario.' },
  { id: 2, nombre: 'Premium Fit Blue', precio: 98999, color: 'Azul', descripcion: 'Camiseta azul de estilo moderno y ajuste cómodo.' },
  { id: 3, nombre: 'Camiseta Casual', precio: 80000, color: 'Negro', descripcion: 'Camiseta casual para complementar tu estilo.' },
  { id: 4, nombre: 'Camiseta Orgánica', precio: 125000, color: 'Beige', descripcion: 'Camiseta suave y cómoda de estilo natural.' },
  { id: 5, nombre: 'Camiseta Casual', precio: 68000, color: 'Blanco', descripcion: 'Camiseta para usar todos los días.' },
  { id: 6, nombre: 'Midnight Black Tee', precio: 87000, color: 'Negro', descripcion: 'Camiseta negra de estilo moderno.' }
];
const precio = n => '$' + Number(n).toLocaleString('es-CO');
const leerCarrito = () => {
  try { return JSON.parse(localStorage.getItem('shopnovaCarrito')) || []; }
  catch { return []; }
};

function Encabezado({ ir, cantidad }) {
  return <header className="sn-header">
    <button className="sn-icon" onClick={() => ir('catalogo')} aria-label="Abrir catálogo">☰</button>
    <button className="sn-logo" onClick={() => ir('inicio')}>SHOPNOVA</button>
    <button className="sn-icon" onClick={() => ir('carrito')} aria-label="Carrito">🛒 <span>{cantidad}</span></button>
  </header>;
}
function App() {
  const [pagina, setPagina] = useState('login');
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [seleccion, setSeleccion] = useState(productos[0]);
  const [talla, setTalla] = useState('M');
  const [color, setColor] = useState('Blanco');
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState(leerCarrito);
  const [mensaje, setMensaje] = useState('');
  const [form, setForm] = useState({ nombre: '', correo: '', fecha: '', contrasena: '' });
  const [pedido, setPedido] = useState(null);
  const [pedidosRealizados, setPedidosRealizados] = useState([]);
  const [medioPago, setMedioPago] = useState('Contraentrega');
  const [direccion, setDireccion] = useState({ nombre: '', telefono: '', direccion: '', ciudad: '', indicaciones: '' });

  const guardarCarrito = nuevo => {
    setCarrito(nuevo);
    localStorage.setItem('shopnovaCarrito', JSON.stringify(nuevo));
  };
  const ir = p => { setMensaje(''); setPagina(p); window.scrollTo(0,0); };
  const agregar = (producto, colorElegido='Blanco', tallaElegida='M', cant=1) => {
    const actual = [...carrito];
    const existente = actual.find(x => Number(x.id) === producto.id && x.color === colorElegido && x.talla === tallaElegida);
    if (existente) existente.cantidad += cant;
    else actual.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, color: colorElegido, talla: tallaElegida, cantidad: cant });
    guardarCarrito(actual);
    setMensaje('Producto agregado al carrito.');
  };
  const quitar = i => guardarCarrito(carrito.filter((_, index) => index !== i));
  const cambiarCantidad = (i, valor) => {
    const nuevo = carrito.map((p, index) => index === i ? { ...p, cantidad: Math.max(1, Number(valor) || 1) } : p);
    guardarCarrito(nuevo);
  };
  const subtotal = carrito.reduce((s,p) => s + p.precio*p.cantidad, 0);
  const envio = carrito.length ? 7000 : 0;
  const total = subtotal + envio;
  const filtrados = useMemo(() => productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())), [busqueda]);

  const abrirDetalle = p => { setSeleccion(p); setColor(p.color); setTalla('M'); setCantidad(1); ir('detalle'); };
  const actualizar = e => setForm({ ...form, [e.target.name]: e.target.value });

  return <div className="sn-app">
    {sesionIniciada && <Encabezado ir={ir} cantidad={carrito.reduce((s,p)=>s+p.cantidad,0)} />}
    {mensaje && <div className="sn-message" role="status">{mensaje}</div>}

    {pagina === 'inicio' && <main>
      <section className="sn-hero"><p>SHOPNOVA</p><h1>Oferta de temporada</h1><p>20% de descuento en básicas</p><button onClick={() => ir('catalogo')}>Comprar ahora</button></section>
      <div className="sn-search"><input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Buscar camisetas" aria-label="Buscar camisetas"/><span>🔍</span></div>
      <h2 className="sn-title">Encuentra tu estilo</h2><Productos lista={filtrados} abrirDetalle={abrirDetalle} agregar={agregar}/>
    </main>}

    {pagina === 'catalogo' && <main><div className="sn-page-title"><h1>Catálogo de productos</h1><p>Encuentra tu estilo</p></div>
      <div className="sn-search"><input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Buscar camisetas" aria-label="Buscar camisetas"/><span>🔍</span></div>
      <Productos lista={filtrados} abrirDetalle={abrirDetalle} agregar={agregar}/></main>}

    {pagina === 'detalle' && <main className="sn-form-page"><button className="sn-back" onClick={()=>ir('catalogo')}>← Volver al catálogo</button><div className="sn-product-image">👕</div>
      <h1>{seleccion.nombre}</h1><p className="sn-price">{precio(seleccion.precio)}</p><p>{seleccion.descripcion}</p>
      <label>Color</label><select value={color} onChange={e=>setColor(e.target.value)}>{['Blanco','Negro','Azul','Beige','Gris'].map(c=><option key={c}>{c}</option>)}</select>
      <label>Talla</label><div className="sn-sizes">{['S','M','L','XL'].map(t=><button className={talla===t?'active':''} key={t} onClick={()=>setTalla(t)}>{t}</button>)}</div>
      <label>Cantidad</label><div className="sn-quantity"><button onClick={()=>setCantidad(Math.max(1,cantidad-1))}>−</button><span>{cantidad}</span><button onClick={()=>setCantidad(cantidad+1)}>+</button></div>
      <button className="sn-primary" onClick={()=>{agregar(seleccion,color,talla,cantidad);ir('carrito');}}>Agregar al carrito</button>
    </main>}

    {pagina === 'carrito' && <main><div className="sn-page-title"><h1>Carrito de compras</h1></div>
      {carrito.length===0 ? <div className="sn-empty"><p>Tu carrito está vacío.</p><button className="sn-primary" onClick={()=>ir('catalogo')}>Ver productos</button></div> :
      <><div className="sn-cart-list">{carrito.map((p,i)=><article className="sn-cart-item" key={`${p.id}-${p.color}-${p.talla}`}>
        <div className="sn-product-thumb">👕</div><div className="sn-cart-info"><h3>{p.nombre}</h3><p>Color: {p.color} · Talla: {p.talla}</p><p>{precio(p.precio)}</p>
        <div className="sn-quantity"><button onClick={()=>cambiarCantidad(i,p.cantidad-1)}>−</button><span>{p.cantidad}</span><button onClick={()=>cambiarCantidad(i,p.cantidad+1)}>+</button><button className="sn-remove" onClick={()=>quitar(i)}>Eliminar</button></div></div>
      </article>)}</div>
      <section className="sn-summary"><p><span>Subtotal</span><b>{precio(subtotal)}</b></p><p><span>Envío</span><b>{precio(envio)}</b></p><p className="sn-total"><span>Total</span><b>{precio(total)}</b></p><button className="sn-primary" onClick={()=>ir('pedido')}>Continuar con el pedido</button></section></>}
    </main>}

    {pagina === 'login' && <main className="sn-form-page sn-login"><h1>SHOPNOVA</h1><h2>Iniciar sesión</h2><p>Ingresa a tu cuenta para continuar con tus compras.</p><form onSubmit={e=>{e.preventDefault();setSesionIniciada(true);setMensaje('Inicio de sesión de demostración.');ir('inicio');}}><label>Correo electrónico</label><input type="email" required value={form.correo} name="correo" onChange={actualizar} placeholder="Ingresa tu correo"/><label>Contraseña</label><input type="password" required value={form.contrasena} name="contrasena" onChange={actualizar} placeholder="Ingresa tu contraseña"/><button className="sn-primary">Iniciar sesión</button></form><button className="sn-link" onClick={()=>ir('registro')}>¿No tienes cuenta? Registrarse</button></main>}

    {pagina === 'registro' && <main className="sn-form-page"><h1>Crear cuenta</h1><form onSubmit={e=>{e.preventDefault();setMensaje('Registro de demostración completado. Ahora puedes iniciar sesión.');ir('login');}}><label>Nombre completo</label><input required name="nombre" value={form.nombre} onChange={actualizar} placeholder="Ingresa tu nombre"/><label>Correo electrónico</label><input required type="email" name="correo" value={form.correo} onChange={actualizar} placeholder="Ingresa tu correo"/><label>Fecha de nacimiento</label><input required type="date" name="fecha" value={form.fecha} onChange={actualizar}/><label>Contraseña</label><input required type="password" name="contrasena" value={form.contrasena} onChange={actualizar} placeholder="Crea una contraseña"/><button className="sn-primary">Crear cuenta</button></form><button className="sn-link" onClick={()=>ir('login')}>¿Ya tienes cuenta? Iniciar sesión</button></main>}

    {pagina === 'pedido' && <main className="sn-form-page sn-order-page"><h1>Datos del pedido</h1><p>Completa la información para la entrega de tu compra.</p><form onSubmit={e=>{e.preventDefault();const nuevoPedido={items:[...carrito],subtotal,envio,total,direccion:{...direccion},medioPago,fecha:new Date().toLocaleDateString('es-CO')};setPedido(nuevoPedido);setPedidosRealizados(prev=>[nuevoPedido,...prev]);guardarCarrito([]);ir('confirmacion');}}><label>Nombre completo</label><input required value={direccion.nombre} onChange={e=>setDireccion({...direccion,nombre:e.target.value})} placeholder="Nombre de quien recibe"/><label>Teléfono</label><input required type="tel" value={direccion.telefono} onChange={e=>setDireccion({...direccion,telefono:e.target.value})} placeholder="Número de contacto"/><label>Dirección de entrega</label><input required value={direccion.direccion} onChange={e=>setDireccion({...direccion,direccion:e.target.value})} placeholder="Calle, carrera, número o vereda"/><label>Ciudad o municipio</label><input required value={direccion.ciudad} onChange={e=>setDireccion({...direccion,ciudad:e.target.value})} placeholder="Ciudad o municipio"/><label>Indicaciones adicionales (opcional)</label><input value={direccion.indicaciones} onChange={e=>setDireccion({...direccion,indicaciones:e.target.value})} placeholder="Barrio, punto de referencia"/><h2>Medio de pago</h2><label htmlFor="medioPago">Selecciona cómo deseas pagar</label><select id="medioPago" value={medioPago} onChange={e=>setMedioPago(e.target.value)}><option>Contraentrega</option><option>Transferencia bancaria</option><option>Nequi</option><option>Daviplata</option></select><p className="sn-payment-note">La selección es demostrativa; no se realiza ningún cobro desde esta página.</p><h2>Resumen de la compra</h2><section className="sn-summary">{carrito.map((p,i)=><p key={i}><span>{p.nombre} ({p.color}, talla {p.talla}) × {p.cantidad}</span><b>{precio(p.precio*p.cantidad)}</b></p>)}<p><span>Subtotal</span><b>{precio(subtotal)}</b></p><p><span>Envío</span><b>{precio(envio)}</b></p><p className="sn-total"><span>Total a pagar</span><b>{precio(total)}</b></p></section><button className="sn-primary" disabled={!carrito.length}>Realizar pedido</button></form></main>}

    {pagina === 'cuenta' && <main className="sn-form-page sn-account-page"><div className="sn-account-avatar">●</div><h1>{form.nombre || 'Nombre de usuario'}</h1><p className="sn-account-email">{form.correo}</p><div className="sn-account-options"><button onClick={()=>ir('mis-pedidos')}><span>▣</span> Mis pedidos <b>→</b></button><button onClick={()=>ir('datos-personales')}><span>□</span> Datos personales <b>→</b></button><button onClick={()=>setMensaje('La configuración de la cuenta está disponible como demostración.')}><span>⚙</span> Configuración <b>→</b></button><button onClick={()=>setMensaje('Para ayuda, consulta las instrucciones de ShopNova.')}><span>?</span> Ayuda <b>→</b></button><button onClick={()=>{setSesionIniciada(false);setForm({...form,contrasena:''});ir('login');}}><span>↪</span> Cerrar sesión <b>→</b></button></div></main>}

    {pagina === 'mis-pedidos' && <main><div className="sn-page-title"><h1>Mis pedidos</h1></div>{pedidosRealizados.length===0 ? <div className="sn-empty"><p>Aún no tienes pedidos realizados en esta sesión.</p><button className="sn-primary" onClick={()=>ir('catalogo')}>Ver productos</button></div> : pedidosRealizados.map((p,i)=><section className="sn-summary" key={i}><h2>Pedido {pedidosRealizados.length-i}</h2><p><span>Fecha</span><b>{p.fecha}</b></p><p><span>Medio de pago</span><b>{p.medioPago}</b></p><p><span>Dirección</span><b>{p.direccion.direccion}, {p.direccion.ciudad}</b></p>{p.items.map((item,j)=><p key={j}><span>{item.nombre} × {item.cantidad}</span><b>{precio(item.precio*item.cantidad)}</b></p>)}<p className="sn-total"><span>Total</span><b>{precio(p.total)}</b></p></section>)}<button className="sn-link" onClick={()=>ir('cuenta')}>← Volver a Mi cuenta</button></main>}

    {pagina === 'datos-personales' && <main className="sn-form-page"><h1>Datos personales</h1><p>Información de la cuenta actual.</p><label>Nombre completo</label><input value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="Nombre completo"/><label>Correo electrónico</label><input type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} placeholder="Correo electrónico"/><button className="sn-primary" onClick={()=>{setMensaje('Datos personales actualizados en esta demostración.');ir('cuenta');}}>Guardar cambios</button><button className="sn-link" onClick={()=>ir('cuenta')}>← Volver a Mi cuenta</button></main>}

    {pagina === 'confirmacion' && <main className="sn-form-page sn-confirm"><div className="sn-check">✓</div><h1>Compra realizada</h1><p>Resumen del pedido de demostración:</p>{pedido && <><p>Nombre: <b>{pedido.direccion.nombre}</b></p><p>Dirección: <b>{pedido.direccion.direccion}, {pedido.direccion.ciudad}</b></p><p>Teléfono: <b>{pedido.direccion.telefono}</b></p><p>Medio de pago: <b>{pedido.medioPago}</b></p><section className="sn-summary">{pedido.items.map((p,i)=><p key={i}><span>{p.nombre} ({p.color}, talla {p.talla}) × {p.cantidad}</span><b>{precio(p.precio*p.cantidad)}</b></p>)}<p><span>Subtotal</span><b>{precio(pedido.subtotal)}</b></p><p><span>Envío</span><b>{precio(pedido.envio)}</b></p><p className="sn-total"><span>Total a pagar</span><b>{precio(pedido.total)}</b></p></section></>}<button className="sn-primary" onClick={()=>ir('catalogo')}>Seguir comprando</button></main>}

    {sesionIniciada && <><footer className="sn-footer">ShopNova · Tienda virtual de camisetas</footer><nav className="sn-nav"><button onClick={()=>ir('inicio')}>Inicio</button><button onClick={()=>ir('catalogo')}>Productos</button><button onClick={()=>ir('cuenta')}>Mi cuenta</button><button onClick={()=>ir('carrito')}>Carrito</button></nav></>}
  </div>;
}

function Productos({lista, abrirDetalle, agregar}) {
  if (!lista.length) return <p className="sn-no-results">No se encontraron camisetas con ese nombre.</p>;
  return <section className="sn-products">{lista.map(p=><article className="sn-product-card" key={p.id}>
    <button className="sn-product-image" onClick={()=>abrirDetalle(p)} aria-label={`Ver ${p.nombre}`}>👕</button>
    <div className="sn-product-info"><h2>{p.nombre}</h2><p>{precio(p.precio)}</p><button className="sn-primary" onClick={()=>agregar(p,p.color,'M',1)}>Agregar al carrito</button><button className="sn-link" onClick={()=>abrirDetalle(p)}>Seleccionar color y talla</button></div>
  </article>)}</section>;
}
export default App;
