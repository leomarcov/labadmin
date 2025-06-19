/**************************************************************
    LABADMIN SCREENSHOT GRID JAVASCRIPT
    Autor: Victor Garrido Cases - CIFP Carlos III
****************************************************************/

window.onload = function() { 
	const LAB = "lab";
	const DIR = "dir";
	const MAP = "map";
    const REF = "ref";
    const SEL = "sel";
	
	const RUTAIMG     = "./assets/";
	const NOHAYEQUIPO = "__";

	const HOST_OFFLINE    = "host_offline";
	const HOST_UNSELECTED = "host_unselected";
	
	const RIGHTARROW  = 39;
	const LEFTARROW  = 37;
	
	let lastTime         = 0;
	let lastTimeAmpliada = 0;
	let lastTimeCache    = 0;
	
	let animationIdAmpliada;

	class Aula {
    
		constructor(datosAula_) {
			// Datos como vienen en la URL
			this.nombre        = datosAula_.nombre;
			this.urlImagenes   = datosAula_.urlImagenes;
			this.mapa          = datosAula_.mapa;
			this.refresco      = datosAula_.refresco;
            this.seleccionados = datosAula_.seleccionados;
			
			// Mapa convertido en array
            this.mapaArray   = datosAula_.mapa.split("\n");

            // Lista de equipos seleccionados (encendidos al inicio) convertida a array. Si valor
            // viene del parámetro SEL de la URL
            this.seleccionadosArray   = datosAula_.seleccionados.trimStart().split(" ");

            // Lista donde iré almacenando los equipos seleccionados que se han apagado
            this.seleccionadosArrayOffline = [];
			
			// Mapa convertido en array bidimensional
			this.mapaArrayB  = this.convertirMapaArrayBidimensional();

			// Mapa convertido en array con los equipos encendidos solamente.
			// Inicialmente están todos y en el primer refresco se quedarán solo los encendidos. 
			//*******************************************************************************************************
			// *****Ahora mismo no lo estamos usando para nada. Lo dejamos por si en un futuro fuera necesario*******
			this.mapaArrayEncendido  = (this.mapaArrayB.flat()).filter(elemento => elemento != NOHAYEQUIPO);
			//*******************************************************************************************************
		
			// Se almacenará el número de PC que se haya ampliado
			this.pcAmpliado  = null;
			
			// Se almacenará el número generado que asociamos a la ruta de la imagen para 
			// evitar que el navegagor la cachee
			//this.IDevitarCache = null;
			this.IDevitarCache = Math.trunc((new Date()).getTime() / (1000 * this.refresco));
		}

		// *********** METODOS DEL OBJETO AULA ********************************************************

		/**********************************************************************************				
		// Método encargado de transformar el array de puestos del aula en un array 
		// bidimensional por fillas
		/*********************************************************************************/
		convertirMapaArrayBidimensional() {
			return this.mapaArray.map((value) => {
					return value.split(" ");					
					});
		}

        /**********************************************************************************				
		// Método encargado de poner el nombre del aula en pantalla
		/**********************************************************************************/
		pintarNombreAula () {
			document.getElementById("aula").innerHTML = this.nombre;					
		}		
				
        /**********************************************************************************				
		// Método encargado de generar la parilla con las imágenes de cada PC en función
		// de los puestos del aula
		/**********************************************************************************/
		generarParrilla () {
			const GRID   = document.getElementById('grid');
            let filas    = this.mapaArrayB.length;
            let columnas = this.mapaArrayB [0].length;
			
            // Configuramos CSS Grid con el número de columnas
            GRID.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;			
			
            // Limpiamos el contenedor antes de agregar nuevos elementos
            GRID.innerHTML = '';
			
            // Crear los divs para cada elemento del array
            this.mapaArrayB.forEach(fila => {
                fila.forEach(item => {

				    GRID.appendChild(this.generarImagenPCParrilla(item));
					
                });
            });
		}
		
		/**********************************************************************************
		// Método encargado de preparar la imagen que queremos ampliar
		/*********************************************************************************/			
		generarImagenPCAmpliada() {
			let urlIMG;
			let imagenPCAmpliada  = document.getElementById("imagenAmpliada");
			
			document.getElementById("nombrePCAmpliado").innerHTML = this.pcAmpliado;

			// Obtenemos la URL de la imagen
			urlIMG = dameRutaImagen(this.pcAmpliado);

			imagenPCAmpliada.id  = imagenPCAmpliada.id;

			imagenPCAmpliada.src = urlIMG;

			imagenPCAmpliada.addEventListener("error",function() {
				// Daría error si por cualquier circunstancia algún PC de los seleccionados
				// inicialmente se apaga, en ese caso aparecerá una imagen de OFFLINE (con color
				// azul). Si se volviera a encender, se reengancharía la imagen 

				this.setAttribute("src", RUTAIMG + HOST_OFFLINE +".svg");
				this.setAttribute("alt","PC desconectado"); // Texto alternativo
				this.removeEventListener("click", abrirModal);
			})
		}
		
		/**********************************************************************************
		// Método encargado de asignar al puesto del aula que recibe por parámetro
		// la imagen que le corresponde. En la inicialización todos estarán apagados
		//
		// Asocia a cada imagen dos manejadores		
		//
		//   - CLICK. Si pulsamos sobre ella se amplia la imagen
		//   - ERROR. Si al buscar la imagen no existe, es que el PC está apagado y carga la imagen
		//            de pantalla negra.
		//
		/*********************************************************************************/			
		generarImagenPCParrilla(item_) {
			let urlIMG;			
			let imagenPC;
			let sinPC;
			
			let figura =  document.createElement('figure');
			let figuraTitulo = document.createElement('figcaption');
			
			figuraTitulo.innerHTML = item_;
//			figuraTitulo.classList.add('textoAzul');
//			figuraTitulo.classList.add('negrita');
			
			if (!isNaN(+item_)) {

				imagenPC = document.createElement('img');
				
				imagenPC.src = urlIMG;
				//imagenPC.id  = "IMG" + item_;
				imagenPC.id  = this.dameIDEquipo(item_);
				
                console.log("CARGO IMAGEN ", imagenPC.src);

				figura.appendChild(imagenPC);
				figura.appendChild(figuraTitulo);
				figura.classList.add('grid-item');
				
				// Ponemos la llamada a la ventana MODAL con la imagen ampliada			
				imagenPC.addEventListener("click", abrirModal);
				
				// Solo le añadimos la gestión del error a aquellos equipos que inicialmente están apagados, para 
				// que no aparezcan en la ampliación de la imagen
				if (!aula.seleccionadosArray.includes(item_)) imagenPC.addEventListener("error", quitarPCApagado);				
				
				return  figura;
				
			} else {
				
				// Si no es un número generaremos una FIGURA pero no le asignamos imagen
				sinPC = document.createElement('figure');
				sinPC.classList.add('grid-item');				
				
				return  sinPC;			
			}			
		}		

		doSomething() {
			console.log(this.nombre);
			console.log(this.urlImagenes);
			console.log(this.mapa);
			console.log(this.refresco);
			console.log(this.mapaArray);
			console.log(this.mapaArrayB);
			console.log(this.mapaArrayEncendido);

			console.log(this.seleccionadosArray);
			console.log(this.seleccionados);
		}
		
		/**********************************************************************************
		// Método encargado de recorrer la parrilla y buscar la imagen correspondiente 
		// en cada posición
		/**********************************************************************************/
		actualizarImagenesParrilla() {
            // Crear los divs para cada elemento del array
            this.mapaArrayB.forEach(fila => {
                fila.forEach(item => {					
						//let imagen = document.getElementById("IMG" + item);
						let imagen = document.getElementById(this.dameIDEquipo(item));

						if (this.seleccionadosArray.includes(item)) {
							imagen.setAttribute("src", dameRutaImagen(item));	

							// Añadimos la apartura de la modal para la imagen ampliada ya que si el equipo seleccionado
							// se apaga se la quitamos para que no se pueda abrir, pero si se vuelve a encender se debería
							// poder a ampliar de nuevo
							imagen.addEventListener("click", abrirModal);

							imagen.addEventListener("error",function() {
								// Daría error si por cualquier circunstancia algún PC de los seleccionados
								// inicialmente se apaga, en ese caso aparecerá una imagen de OFFLINE (con color
								// al gris). Si se volviera a encender, se reengancharía la imagen 

								this.setAttribute("src", RUTAIMG + HOST_OFFLINE +".svg");
								this.setAttribute("alt","PC desconectado"); // Texto alternativo
								this.removeEventListener("click", abrirModal);
							})
						}
                });
            });	
		}


		/**********************************************************************************
		// Nos dice si un equipo de los equipos seleccionados está apagado. Estará apagado
		// si como imagen le hemos puesto la imagen HOST_OFFLINE
		/**********************************************************************************/
		equipoSeleccionadoEsteApagado (item_) {
			if (document.getElementById(this.dameIDEquipo(item_)).getAttribute("src").includes(HOST_OFFLINE))
				return true;
			else return false;
		}

		dameIDEquipo (item_) {
			return ("IMG" + item_);
		}
	}	
	
	/***********************************************************************************************
	************************************* FUNCIONES AUXILIARES *************************************
	************************************************************************************************/
	function quitarPCApagado (event) {
		let item = (event.target.id).substring(3);
		let resultado = aula.mapaArrayEncendido.filter(elemento => elemento != item);
		aula.mapaArrayEncendido = resultado;
		
		event.target.removeEventListener("click", abrirModal);
		event.target.src = RUTAIMG + HOST_UNSELECTED + ".svg";
		event.target.alt = "PC desconectado"; // Texto alternativo

		// Una vez eliminado el equipo apagado de la lista de equipos encendidos, quito el manejadores
		// para que no siga haciéndolo en los refrescos
		event.target.removeEventListener(event.type, quitarPCApagado);			
	}



	/**********************************************************************************
	// Método encargado de obtener los datos del aula que se envían a través de la URL
	// Estos datos vienen codificados en BASE64 exceto último parámetro que va sin codificar
	//
	//    - lab --> Nombre del aula
	//    - dir --> URL dónde están las imágenes
	//    - map --> Mapa del aula
	//    - ref --> Tasa de refresco
	//
	// Además asocia a cada imagen la posibilidad de pulsar sobre ella y ampliarla
	/*********************************************************************************/			
	function obtenerDatosAulaDesdeURL() {
		const URLSEARCH = location.search;		
		const PARAMS = new URLSearchParams(URLSEARCH);
	
		console.log(PARAMS);

		// Devolvemos un objeto con los datos de aula extraidos de la URL
		return { nombre        : atob(PARAMS.get(LAB)),
		         urlImagenes   : atob(PARAMS.get(DIR)),
				 mapa          : atob(PARAMS.get(MAP)),
				 refresco      : PARAMS.get(REF),
				 seleccionados : atob(PARAMS.get(SEL))
			   }		
	}
	
	function cerrarVentanaModal() {
		cancelAnimationFrame(animationIdAmpliada); 
		window.modal.close();
	}
	
	function abrirModal(event) {
		window.modal.showModal();
		aula.pcAmpliado = event.target.id.substr(3) // Quitamos el IMG del principio;
		aula.generarImagenPCAmpliada();
		animationIdAmpliada=requestAnimationFrame(visualizarAmpliada);
		document.getElementById("cerrarModal").onclick = cerrarVentanaModal;					
	}

    function visualizarAmpliada(currentTimeAmpliada) {
		if ((currentTimeAmpliada - lastTimeAmpliada ) >= 1000 * aula.refresco) {
			aula.generarImagenPCAmpliada();			
			lastTimeAmpliada = currentTimeAmpliada;
		}
		animationIdAmpliada=requestAnimationFrame(visualizarAmpliada);
	}
	
	function calcularDisplaySize(event) {
		let size = event.target.value;
            
        // Aplicar la escala al grid
        let scale = size / 50;
        //grid.style.transform = `scale(${scale})`;	 	// Forma anterior que no mostraba barra scroll
        grid.style.zoom = scale;
	}
	

	/*****************************************************************************
	// Función que devuelve el número que tendrá el nombre de la imagen	
	// añadido al final para solucionar el problema de refresco de estas
	// imágenes por la caché del navegador
	*****************************************************************************/
	function dameRutaImagen(item_) {
		let url = aula.urlImagenes + "/" +item_  + `-${aula.IDevitarCache}`+".jpg";
		return(url);			
	}

	function generarIDevitarCacheImagen(currentTime) {
		if ((currentTime - lastTimeCache ) >= 1000 * aula.refresco) {
			aula.IDevitarCache = Math.trunc((new Date()).getTime() / (1000 * aula.refresco));
			lastTimeCahe = currentTime;
		}
				
		requestAnimationFrame(generarIDevitarCacheImagen);
	}


	/*****************************************************************************
	/*****************************************************************************/
	function visualizarParrilla(currentTime) {
		if ((currentTime - lastTime ) >= 1000 * aula.refresco) {
			aula.actualizarImagenesParrilla();
			lastTime = currentTime;
		}
		requestAnimationFrame(visualizarParrilla);
	}

	/*****************************************************************************
	/*****************************************************************************/
	function obtenerIndice(value) {
		return value == aula.pcAmpliado;
	}

	function manejarPCsAmpliados(event) {
		if ((event.keyCode == RIGHTARROW)  || (event.target.id == "PCAmpliadoSiguiente")) {
			mostrarPCAmpliadoSiguiente();
		} else if ((event.keyCode == LEFTARROW) || (event.target.id == "PCAmpliadoAnterior")) {
			mostrarPCAmpliadoAnterior();
		}
	}
	
	function mostrarPCAmpliadoSiguiente() {
		// Buscamos el elemento que estamos viendo en el array		
		let found = aula.seleccionadosArray.findIndex(obtenerIndice);
		do {
		
			// Calculamos el equipo SIGUIENTE (están almacenados en orden inverso por lo que el siguiente es -1)
			// si NO está encendido buscamos otro hasta encontrar uno encendido			
			found = (found == 0) ? aula.seleccionadosArray.length-1
								 : (found - 1) % aula.seleccionadosArray.length;
		} while (aula.equipoSeleccionadoEsteApagado(aula.seleccionadosArray[found]));

		// Cambiamos al anterior
		aula.pcAmpliado  = aula.seleccionadosArray[found];
		aula.generarImagenPCAmpliada();			
	}
	
	function mostrarPCAmpliadoAnterior() {
		//console.log("buscandoElemento. EN PANTALLA ", aula.pcAmpliado);
		
		// Buscamos el elemento que estamos viendo en el array		
		let found = aula.seleccionadosArray.findIndex(obtenerIndice);
		
		//console.log("buscandoElemento. INDICE ENCONTRADO ",found);
		//console.log("buscandoElemento. EQUIPOS ENCENDIDOS INICIALMENTE",aula.seleccionadosArray.length);
		
		do {

			// Calculamos el equipo anterior (están almacenados en orden inverso por lo que el anterior es +1), 
			// si NO está encendido buscamos otro hasta encontrar uno encendido
			found = (found + 1) % aula.seleccionadosArray.length;

		} while (aula.equipoSeleccionadoEsteApagado(aula.seleccionadosArray[found]));
		
		//console.log("buscandoElemento. ELEMENTO SIGUINETE ", aula.seleccionadosArray[found]);
		
		// Cambiamos al anterior
		aula.pcAmpliado  = aula.seleccionadosArray[found];
		aula.generarImagenPCAmpliada();				

	}
	// CÓDIGO PRINCIPAL -----------------------------------------------------
	//***********************************************************************


	//Asociamos el método que cambia el tamaño de la parrilla
	document.getElementById("displaySize").addEventListener("input", calcularDisplaySize);
	
	let aula = new Aula (obtenerDatosAulaDesdeURL());
	
	aula.pintarNombreAula();		
	aula.generarParrilla();		
	aula.actualizarImagenesParrilla();


	// Lanzamos la generación de ID asociado a la imagen para evitar la caché del navegador
	requestAnimationFrame(generarIDevitarCacheImagen);

	// Lanzamos la actualización automática de las imágenes de la parrilla
	requestAnimationFrame(visualizarParrilla);	


	// Asociamos los manejadores que nos permiten cambiar la imagen del PC ampliado para ver el siguiente o el anterior
	document.getElementById("PCAmpliadoSiguiente").addEventListener("click", manejarPCsAmpliados);
	document.getElementById("PCAmpliadoAnterior").addEventListener("click", manejarPCsAmpliados);
	document.addEventListener("keydown", manejarPCsAmpliados, false);
		
	aula.doSomething();



    //******************************************************************************************************
    // Gestión del scroll con el ratón en el zoom 
    const range = document.getElementById('displaySize');

    range.addEventListener('wheel', function(e) {
      e.preventDefault(); // Previene el scroll de la página

      const step = parseFloat(range.step) || 1;
      const delta = Math.sign(e.deltaY); // +1 o -1 según dirección del scroll

      // Invertimos el signo si quieres que scroll hacia arriba aumente
      range.value = Math.min(range.max, Math.max(range.min, parseFloat(range.value) - delta * step));

    });

    range.addEventListener("wheel", calcularDisplaySize);
   //******************************************************************************************************


	// -----------------------------------------------------------------------
	//************************************************************************
}
