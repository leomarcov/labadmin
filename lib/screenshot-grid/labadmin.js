window.onload = function() { 

	const LAB = "lab";
	const DIR = "dir";
	const MAP = "map";
    const REF = "ref";
	
	const RUTAIMG     = "./assets/";
	const NOHAYEQUIPO = "__";
	
	let lastTime         = 0;
	let lastTimeAmpliada = 0;
	let lastTimeCache    = 0;
	
	let animationIdAmpliada;

	class Aula {
    
		constructor(datosAula_) {
			
			// Datos como vienen en la URL
			this.nombre      = datosAula_.nombre;
			this.urlImagenes = datosAula_.urlImagenes;
			this.mapa        = datosAula_.mapa;
			this.refresco    = datosAula_.refresco;

			
			// Mapa convertido en array
            this.mapaArray   = datosAula_.mapa.split("\n");
			
			// Mapa convertido en array bidimensional
			this.mapaArrayB  = this.convertirMapaArrayBidimensional();
		
			// Se almacenará el número de PC que se haya ampliado
			this.pcAmpliado  = null;
			
			// Se almacenará el número generado que asociamos a la ruta de la imagen para 
			// evitar que el navegagor la cachee
			this.IDevitarCache = null;
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

			imagenPCAmpliada.src = urlIMG;
			imagenPCAmpliada.id  = imagenPCAmpliada.id;
			
			console.log("xxxx " + urlIMG);
			
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
			figuraTitulo.classList.add('textoAzul');
			figuraTitulo.classList.add('negrita');
			
			if (!isNaN(+item_)) {

				imagenPC = document.createElement('img');
				
				imagenPC.src = urlIMG;
				imagenPC.id  = "IMG" + item_;
				
				figura.appendChild(imagenPC);
				figura.appendChild(figuraTitulo);
				figura.classList.add('grid-item');
				
				// Ponemos la llamada a la ventana MODAL con la imagen ampliada			
				imagenPC.addEventListener("click", abrirModal);

				// Si no existe imagen para ese PC es porque está apagado, 
				// cargamos la imagen de PC apagado y desactivamos el click
				imagenPC.addEventListener("error", function() {
					
//					this.removeEventListener("click", abrirModal);
					this.src = RUTAIMG + "apagado.svg";
					this.style.visibility = "hidden";
					
				});	
				imagenPC.style.visibility = "";
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
			console.log(this.mapaArrayB);
		}
		
		/**********************************************************************************
		// Método encargado de recorrer la parrilla y buscar la imagen correspondiente 
		// en cada posición
		/**********************************************************************************/
		
		actualizarImagenesParrilla() {

		    //let epoch = Math.trunc((new Date()).getTime() / (1000 * aula.refresco));


            // Crear los divs para cada elemento del array
            this.mapaArrayB.forEach(fila => {
                fila.forEach(item => {
					
					try {
						let imagen = document.getElementById("IMG" + item);
						imagen.setAttribute("src", dameRutaImagen(item));
					} catch (error) {}
					
                });
            });						
		}		
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
	
		/** CAMBIAR. Descomentamos la primera URLsearch y quitamos la segunda*/
		const URLSEARCH = location.search;		
		//const URLSEARCH = "?lab=QVVMQSAxNQ==&dir=L3RtcC9sYWJhZG1pbi0xMDAwL3NjcmVlbnNob3Qtdmlld2VyLw==&map=NTYgNTUgNTQgNTMgNTIgNTEKNDYgNDUgNDQgNDMgNDIgNDEKMzYgMzUgMzQgMzMgMzIgMzEKMjYgMjUgMjQgMjMgMjIgMjEKX18gX18gMTQgMTMgMTIgMTEKX18gX18gX18gX18gX18gMDA=&ref=5";
		
		const PARAMS = new URLSearchParams(URLSEARCH);
		
		console.log(PARAMS);

		// Devolvemos un objeto con los datos de aula extraidos de la URL
		return { nombre      : atob(PARAMS.get(LAB)),
		         urlImagenes : atob(PARAMS.get(DIR)),
				 mapa        : atob(PARAMS.get(MAP)),
				 refresco    : PARAMS.get(REF)
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
        grid.style.transform = `scale(${scale})`;			
		
	}
	
	/*****************************************************************************
	// Función que devuelve el número que tendrá el nombre de la imagen	
	// añadido al final para solucionar el problema de refresco de estas
	// imágenes por la caché del navegador
	*****************************************************************************/
	function dameRutaImagen(item_) {
		

		let url = aula.urlImagenes + "/" +item_  + `-${aula.IDevitarCache}`+".jpg";

		/** CAMBIAR. Descomentamos la primera URL y quitamos la segunda*/
		//let url = "./assets/screenshots_test/" + item_+ `-${contadorImagenRuta}`+".jpg";

		return(url);
			
	}

	function generarIDevitarCacheImagen(currentTime) {
		
		if ((currentTime - lastTimeCache ) >= 1000 * aula.refresco) {
			aula.IDevitarCache = Math.trunc((new Date()).getTime() / (1000 * aula.refresco));
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

	// CÓDIGO PRINCIPAL -----------------------------------------------------
	//***********************************************************************
	
	document.getElementById("displaySize").addEventListener("input", calcularDisplaySize);
	
	let aula = new Aula (obtenerDatosAulaDesdeURL());
	
	aula.pintarNombreAula();		
	aula.generarParrilla();	
	aula.actualizarImagenesParrilla();


	// Lanzamos la generación de ID asociado a la imagen para evitar la caché del navegador
	requestAnimationFrame(generarIDevitarCacheImagen);

	// Lanzamos la actualización automática de las imágenes de la parrilla
	requestAnimationFrame(visualizarParrilla);	
	
	aula.doSomething();
	
	// -----------------------------------------------------------------------
	//************************************************************************
}
