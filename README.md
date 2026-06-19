# App de pedidos

Pequena app web para preparar pedidos por proveedor y enviar la lista por WhatsApp.

## Como usarla

Abre `index.html` en el navegador. En iPhone, subela a una web o compartela por una ruta accesible, abrela en Safari y usa **Compartir > Anadir a pantalla de inicio**.

## Cambiar proveedores y productos

Edita el archivo `app.js`. Al principio hay una lista llamada `providers`; ahi puedes cambiar nombres de proveedores, tipos y productos.

Cada proveedor tiene:

- `id`: identificador interno, sin espacios.
- `name`: nombre que ves en pantalla.
- `type`: categoria corta del proveedor.
- `whatsappNumber`: numero con prefijo de pais, por ejemplo `34600111222`. Si lo dejas vacio, WhatsApp te dejara elegir el contacto.

Cada producto tiene:

- `id`: identificador interno, sin espacios.
- `name`: nombre que ves en pantalla.
- `unit`: unidad que saldra en el pedido, por ejemplo `kg`, `caja`, `ud` o `paquete`.

El boton **Enviar por WhatsApp** abre WhatsApp con el mensaje preparado para revisar y enviar.
