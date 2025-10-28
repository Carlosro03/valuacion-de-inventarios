let productos = [];

function agregarProducto() {
    let nombre = document.getElementById("nombreProducto").value;
    let cantidad = parseInt(document.getElementById("cantidadProducto").value);
    let costo = parseFloat(document.getElementById("costoProducto").value);

    if(nombre && cantidad > 0 && costo > 0){
        productos.push({
            nombre: nombre,
            stock: cantidad,
            costos: Array(cantidad).fill(costo)
        });
        actualizarListaProductos();
        actualizarTabla();
        actualizarTarjetas();
        alert("Producto agregado correctamente");

        // Limpiar campos
        document.getElementById("nombreProducto").value = "";
        document.getElementById("cantidadProducto").value = "";
        document.getElementById("costoProducto").value = "";
    } else {
        alert("Ingrese todos los datos correctamente");
    }
}

function actualizarListaProductos() {
    let lista = document.getElementById("listaProductos");
    lista.innerHTML = "";
    productos.forEach((p, i) => {
        let option = document.createElement("option");
        option.value = i;
        option.text = p.nombre;
        lista.add(option);
    });
}

function realizarVenta() {
    let index = parseInt(document.getElementById("listaProductos").value);
    let cantidad = parseInt(document.getElementById("cantidadVenta").value);
    let precioVenta = parseFloat(document.getElementById("precioVenta").value);

    if(index >= 0 && cantidad > 0 && precioVenta > 0){
        let producto = productos[index];
        if(cantidad > producto.stock){
            alert("No hay suficiente stock");
            return;
        }

        for(let i=0; i<cantidad; i++){
            producto.costos.pop(); 
        }
        producto.stock -= cantidad;

        let subtotal = precioVenta * cantidad;
        alert("Venta realizada. Subtotal: " + subtotal.toFixed(2));

        actualizarTabla();
        actualizarTarjetas();

        // Limpiar campos de venta
        document.getElementById("cantidadVenta").value = "";
        document.getElementById("precioVenta").value = "";
        document.getElementById("listaProductos").selectedIndex = 0;

    } else {
        alert("Ingrese correctamente los datos de venta");
    }
}

function actualizarTabla() {
    let tbody = document.querySelector("#tablaInventario tbody");
    tbody.innerHTML = "";

    productos.forEach(p => {
        let costoUEPS = p.costos.length > 0 ? p.costos[p.costos.length - 1] : 0;
        let costoPEPS = p.costos.length > 0 ? p.costos[0] : 0;
        let costoPromedio = p.costos.length > 0 ? (p.costos.reduce((a,b)=>a+b,0)/p.costos.length) : 0;

        let row = `<tr>
            <td>${p.nombre}</td>
            <td>${p.stock}</td>
            <td>${p.costos.length>0 ? p.costos[0] : 0}</td>
            <td>${costoUEPS.toFixed(2)}</td>
            <td>${costoPEPS.toFixed(2)}</td>
            <td>${costoPromedio.toFixed(2)}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function actualizarTarjetas() {
    let totalProductos = productos.length;
    let stockTotal = productos.reduce((a,b)=>a+b.stock,0);
    let valorUEPS = productos.reduce((a,b)=>a+(b.costos.length>0 ? b.costos[b.costos.length-1]*b.stock :0),0);
    let valorPEPS = productos.reduce((a,b)=>a+(b.costos.length>0 ? b.costos[0]*b.stock :0),0);
    let valorPromedio = productos.reduce((a,b)=>a+(b.costos.length>0 ? (b.costos.reduce((x,y)=>x+y,0)/b.costos.length)*b.stock :0),0);

    document.getElementById("totalProductos").textContent = totalProductos;
    document.getElementById("stockTotal").textContent = stockTotal;
    document.getElementById("valorUEPS").textContent = valorUEPS.toFixed(2);
    document.getElementById("valorPEPS").textContent = valorPEPS.toFixed(2);
    document.getElementById("valorPromedio").textContent = valorPromedio.toFixed(2);
}

function exportarHTML() {
    let tabla = document.getElementById("tablaInventario").outerHTML;
    let tarjetas = `
        <h1>Resumen de Inventario</h1>
        <p>Total Productos: ${document.getElementById("totalProductos").textContent}</p>
        <p>Stock Total: ${document.getElementById("stockTotal").textContent}</p>
        <p>Valor UEPS: ${document.getElementById("valorUEPS").textContent}</p>
        <p>Valor PEPS: ${document.getElementById("valorPEPS").textContent}</p>
        <p>Valor Promedio: ${document.getElementById("valorPromedio").textContent}</p>
        <hr>
    `;

    let contenidoHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Inventario Exportado</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; background: #f0f4f8; color: #2c3e50; }
                h1 { text-align: center; color: #1f3c88; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 10px; text-align: center; }
                th { background-color: #2980b9; color: white; }
                tr:nth-child(even) { background-color: #f4f7fa; }
            </style>
        </head>
        <body>
            ${tarjetas}
            ${tabla}
        </body>
        </html>
    `;

    let blob = new Blob([contenidoHTML], { type: "text/html" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "Inventario.html";
    a.click();
    URL.revokeObjectURL(url);
}
