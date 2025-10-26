# Frontend Club Union Unquillo - Fragmentos del documento técnico

## Tecnologías

- Backend - JDK Java 17 y Spring Boot v3.3.2 con Maven v3.9
- Frontend - Angular 19, con standalone components, junto con las librerías de
- componentes de Bootstrap 5+, Bootstrap Icons, SweetAlert2 y Google Charts
para los KPIs.
- Base de Datos - MySQL 8+ para producción y H2 para el desarrollo.
- Integraciones - Se integró Keycloak, una plataforma para la gestión de
identidades y accesos (IAM), utilizada para la Autenticación y Autorización de
usuarios, y también la API de Mercado Pago (Checkout Pro), para integrar el
pago de Cuotas.
- Gestión del proyecto - Jira con tablero Scrum

## Objetivo
Implementar y desplegar una plataforma web integral para el Club Unión Unquillo antes
de Diciembre 2025, que digitalice el 100% de sus procesos administrativos, y contribuya a
eliminar el uso de papel en las gestiones principales, automatizar el 90% de los pagos
mediante la integración con Mercado Pago, centralizar la información en dashboards
personalizados por rol, reducir en un 80% el tiempo de gestión administrativa en papel. Para
demostrar el exito de la implementación, se espera que el 80% de la comunidad utilice la
plataforma en los primeros 4 meses.
Se busca garantizar la sostenibilidad, al eliminar el uso de miles de hojas de papel
anuales, transparencia, al dar acceso en tiempo real a datos financieros y operativos del
Club y eficiencia, al digitalizar sus gestiones.

## Conclusión
En fin, la página web del CUU es esencial para el funcionamiento eficiente del Club,
una solución integral que le dará el salto hacia una gestión ágil y moderna para los
Administradores; toda la información necesaria para los interesados en unirse al club;
el control de sus inscripciones y pago de cuotas online para los Alumnos y la gestión
de sus Disciplinas y respectivas cuotas e inscriptos para los Profesores.
La integración con Keycloak provee un servicio de Autenticacion y Autorizacion
seguro y confiable que cumple los estándares de seguridad actuales, garantizando
así la seguridad de los datos y un gran control sobre permisos y roles, ya sean de
otros servicios que utilice el Club o servicios que hagan uso del Club, cómo también
sobre los permisos y roles asignados a cada tipo de usuario.
La integración con Mercado Pago Checkout Pro para el pago de Cuotas, ya sean
del Club o de una Disciplina, agrega transparencia y confianza en el proceso de pago
y recaudación del Club.
Esto da cómo resultado una página web segura y confiable para llevar a cabo todos
los procesos del Club, de forma eficiente y sin uso innecesario de papel.

## Users Stories - Extraídas del tablero del proyecto en Jira
### US 1 - Pantalla Inicio/Login

Como: Usuario 

Quiero: iniciar sesión en Club Union Unquillo 

Para: acceder a la pagina del Club


#### Criterios de aceptación BDD

Escenario 1: Iniciar sesion - Success

    Given: que estoy en la pantalla de inicio
    
    When: ingreso el usuario y contraseña correctos
    
    Then: inicia sesión y pasa a pantalla principal



Escenario 1: Iniciar sesion - Error

    Given: que estoy en la pantalla de inicio
    
    When: ingreso el usuario y contraseña (incorrectos)
    
    Then: msj indica error (Usuario o Contraseña incorrectos)


### US 2 - Pantalla Inicio/Registrar nueva cuenta 

Como: Usuario

Quiero: registrar mi cuenta en Club Union Unquillo

Para: acceder a la pagina del Club



#### Criterios de aceptación BDD

Escenario 1: Registrar nueva cuenta - Success

    Given: que estoy en la pantalla de inicio y selecciono Registrarme
    
    When: ingreso correo electrónico (disponible) Y contraseña (válida) Y mis datos personales necesarios 
    
    Then: crea la cuenta (rol Alumno) Y vuelve a pantalla Inicio (para q pueda iniciar sesión con la cuenta recién creada)



Escenario 1: Registrar nueva cuenta - Error

    Given: que estoy en la pantalla de inicio y selecciono Registrarme
    
    When: ingreso correo electrónico Y contraseña (INVALIDOS)
    
    Then: mensaje indica error puntual (email ya registrado, contraseña invalida, etc)


### US 3 - Pantalla Inicio/Olvide mi contraseña 

Como: Usuario

Quiero: cambiar mi contraseña pq la olvide

Para: acceder a la pagina del Club



#### Criterios de aceptación BDD

Escenario 1: Cambiar contraseña - Success

    Given: que estoy en la pantalla de inicio y selecciono Olvide mi contraseña 
    
    When: ingreso correo electrónico (Registrado) 
    
    Then: se envía mail para cambiar contraseña al correo indicado



Escenario 1: Cambiar contraseña - Error

    Given: que estoy en la pantalla de inicio y selecciono Olvide mi contraseña
    
    When: ingreso correo electrónico (NO Registrado)
    
    Then: msj indica q el mail NO está registrado 


### US 4 - Pantalla Principal/Disciplinas rol Alumno 

Como: Usuario Alumno 

Quiero: ver las disciplinas a las q me puedo inscribir 

Para: inscribirme a la/las disciplina/s 



#### Criterios de aceptación BDD

Escenario 1: Inscribirme a Disciplina - Success

  Given: sesión activa y Pantalla Disciplinas
  
  When: selecciono una Disciplina y cumplo las condiciones de dicha disciplina 
  
  Then: se me inscribe a la Disciplina 

*condiciones 
- Si hay Cupos disponibles
- Si cumple el rango de edad
- Si NO tiene otras disciplinas en el mismo horario y dia



Escenario 1: Inscribirme a Disciplina - Error

    Given: sesión activa y Pantalla Disciplinas 
    
    When: selecciono la Disciplina pero No cumplo las condiciones 
    
    Then: msj indica la/las condicione/s q NO se cumplen 


### US 5 - Pantalla MisDisciplinas/Disciplinas rol Profesor 

Como: Usuario Profesor 

Quiero: ver mis disciplinas

Para: gestionar mis Disciplinas (ver q alumnos están inscritos, poder desinscribir, promover de categoría, etc.)



#### Criterios de aceptación BDD

Escenario 1:  Crear/Editar Disciplina - Success

    Given: sesión activa Y pantalla MisDisciplinas 
    
    When: selecciono Y modifico una Disciplina y/o Categoría (pero no cambio sus atributos criticos)
    
    Then: se guardan las modificaciones.


*atributos criticos:
- Cambio en Minimo o Máximo de edad
- Cambio en Dias y Horarios (si es q los cambios coinciden con otra Categoría de la MISMA Disciplina)


Escenario 1: Crear/Editar Disciplina - Warning

    Given: sesión activa Y pantalla MisDisciplinas
    
    When: selecciono y modifico una Disciplina y/o Categoría (cambiando alguno de sus atributos criticos)
    
    Then: sale un Popup advirtiendo sobre los cambios (Cancelar: vuelve al form/Confirmar: guarda las modificaciones Y notifica por mail a todos los Alumnos de la Categoría/Disciplina)


Escenario 2: Cambiar de Categoría a un Alumno - Success

    Given: sesión activa Y pantalla MisDisciplinas 
    
    When: selecciono un Alumno de una Categoría/Disciplina Y le selecciono otra Categoría (donde SI cumple las condiciones)
    
    Then: al Alumno se le desinscribe de la Categoría anterior Y se le inscribe a la NUEVA Categoría (se le notifica por mail)



*condiciones 
- Si hay Cupos disponibles
- Si cumple el rango de edad
- Si NO tiene otras disciplinas en el mismo horario y dia



Escenario 2: Cambiar de Categoría a un Alumno  - Error

    Given: sesión activa Y pantalla MisDisciplinas
    
    When: selecciono un Alumno de una Categoría/Disciplina Y le selecciono otra Categoría (donde NO cumple las condiciones)
    
    Then: msj indica cuáles condiciones NO cumple 



Escenario 3: Desinscribir a un Alumno de una Categoría - Success

    Given: sesión activa Y pantalla MisDisciplinas
    
    When: selecciono un Alumno de una Categoría/Disciplina O un Alumno de todos mis alumnos Y selecciono DESINSCRIBIR
    
    Then: al Alumno se le desinscribe de la Categoría (se le notifica por mail)


### US 6 - Pantalla MisCosas/Disciplinas rol Alumno

Como: Usuario Alumno

Quiero: ver las Disciplinas donde estoy inscrito 

Para: gestionar las Disciplinas donde estoy inscrito (ver mis Categorías, horarios, info relacionada, etc.) (capaz tmb un acceso directo a las Cuotas de esa Disciplina)


#### Criterios de aceptación BDD

Escenario 1: Desinscribirme de una Disciplina - Success

    Given: sesión activa Y pantalla MisCosas 
    
    When: selecciono Desinscribirme dentro de una Disciplina (a la cual estoy inscrito) Y CONFIRMO la acción 
    
    Then: se me Desinscribe de esa Disciplina 



Escenario 1: Desinscribirme de una Disciplina - Accion cancelada 

    Given: sesión activa Y pantalla MisCosas 
    
    When: selecciono Desinscribirme dentro de una Disciplina (a la cual estoy inscrito) Y CANCELO la acción
    
    Then: NO se Desinscribe Y vuelve a Pantalla MisCosas 



Escenario 2: Cambiar de Categoría dentro de una Disciplina - Success

    Given: sesión activa Y pantalla MisCosas 
    
    When: selecciono Categorías de una Disciplina (la cual debe tener 2 o + Categorías) Y elijo una Categoría (donde NO estoy inscrito) Y cumplo las condiciones de dicha Categoría 
    
    Then: se me Desinscribe de la Categoría actual Y se me Inscribe a la nueva Categoría elegida 


*condiciones
- Si hay Cupos disponibles
- Si cumple el rango de edad
- Si NO tiene otras disciplinas en el mismo horario y dia


Escenario 2: Cambiar de Categoría dentro de una Disciplina - Error

    Given: sesión activa Y pantalla MisCosas
    
    When: selecciono Categorías de una Disciplina (la cual debe tener 2 o + Categorías) Y elijo una Categoría (donde NO estoy inscrito) Pero NO cumplo las condiciones de dicha Categoría
    
    Then: msj indica cual/es condicion/es NO se cumplen 


### US 7 - Pantalla MisCosas/Cuotas rol Alumno

Como: Usuario Alumno

Quiero: ver las Cuotas q debo Y q ya pague

Para: ver cuáles Cuotas me faltan abonar


#### Criterios de aceptación BDD

Escenario 1: Pagar Cuota Social - Success
    
    Given: sesión activa Y pantalla MisCosas 
    
    When: selecciono una Cuota Social (no pagada) Y completo la pasarela en MP correctamente
    
    Then: marca esa Cuota Social como PAGADA Y me devuelve a Pantalla MisCosas 


Escenario 1: Pagar Cuota Social - Error

    Given: sesión activa Y pantalla MisCosas
    
    When: selecciono una Cuota Social (no pagada) Y NO completo la pasarela en MP (u ocurre un Error)
    
    Then: msj indica q error ocurrió (no completo el Pago, no se pudo realizar la transferencia, etc) Y me devuelve a Pantalla MisCosas



Escenario 2: Pagar Cuota de una Disciplina - Success

    Given: sesión activa Y pantalla MisCosas
    
    When: selecciono una Cuota de una Disciplina (no pagada) Y completo la pasarela en MP correctamente
    
    Then: marca esa Cuota de esa Disciplina como PAGADA Y me devuelve a Pantalla MisCosas


Escenario 2: Pagar Cuota de una Disciplina - Error

    Given: sesión activa Y pantalla MisCosas
    
    When: selecciono una Cuota de una Disciplina (no pagada) Y NO completo la pasarela en MP (u ocurre un Error)
    
    Then: msj indica q error ocurrió (no completo el Pago, no se pudo realizar la transferencia, etc) Y me devuelve a Pantalla MisCosas



Escenario 3: Ver Cuotas q ya pague - Success

    Given: sesión activa Y pantalla MisCosas 
    
    When: selecciono Ver Cuotas Pagas
    
    Then: me muestra mi historial de Cuotas (Social y de cada Disciplina) (tmb habría filtros de fecha, estado: Pagada/SinPagar, y tipo: Social/Disciplina)


### US 8 - Pantalla MisDisciplinas/Alumnos rol Profesor

Como: Usuario Profesor

Quiero: gestionar las Cuotas de mis Disciplinas

Para: ver q alumnos están al día y cuáles no



#### Criterios de aceptación BDD

Escenario 1: Ver cuáles Alumnos tienen pagos atrasados - Success

    Given: sesión activa Y pantalla MisDisciplinas
    
    When: selecciono Cuotas 
    
    Then: muestra en orden: Alumnos q NO pagaron el mes anterior (y anteriores), Alumnos q SI pagaron los anteriores meses 



Escenario 2: Marcar como pagada la Cuota DISCIPLINA de un Alumno (pago en efectivo) - Success

    Given: sesión activa Y pantalla MisDisciplinas 
    
    When: selecciono un Alumno/Cuotas Y marco una Cuota específica como pagada
    
    Then: se actualiza el estado de esa Cuota a PAGADA (se actualiza el listado de cuotas del alumno)

Escenario 2: Marcar como pagada la Cuota DISCIPLINA de un Alumno (pago en efectivo) - Error

    Given: sesión activa Y pantalla MisDisciplinas
    
    When: selecciono un Alumno/Cuotas Y marco una Cuota específica como pagada PERO no se pudo actualizar el estado
    
    Then: msj indica error en el servidor 


### US 9 - Pantalla Gestión/Disciplinas rol SuperAdmin-Secretaria 

Como: Usuario SuperAdmin-Secretaria 

Quiero: gestionar las Disciplinas del Club

Para: mantener actualizadas las disciplinas



#### Criterios de aceptación BDD

Escenario 1: Crear/Editar Disciplina - Success

    Given: sesión activa Y pantalla MisDisciplinas
    
    When: selecciono y modifico una Disciplina y/o Categoría (pero no cambio sus atributos criticos)
    
    Then: se guardan las modificaciones.



*atributos criticos:
- Cambio en Minimo o Máximo de edad
- Cambio en Dias y Horarios (si es q los cambios coinciden con otra Categoría de la MISMA Disciplina)



Escenario 1: Crear/Editar Disciplina - Warning

    Given: sesión activa Y pantalla MisDisciplinas
    
    When: selecciono y modifico una Disciplina y/o Categoría (cambiando alguno de sus atributos criticos)
    
    Then: sale un Popup advirtiendo sobre los cambios (Cancelar: vuelve al form/Confirmar: guarda las modificaciones Y notifica por mail a todos los Alumnos de la Categoría/Disciplina)


Escenario 2: Cambiar de Categoría a un Alumno - Success

    Given: sesión activa Y pantalla MisDisciplinas
    
    When: selecciono un Alumno de una Categoría/Disciplina O un Alumno de todos mis alumnos Y le selecciono otra Categoría (donde SI cumple las condiciones)
    
    Then: al Alumno se le desinscribe de la Categoría anterior Y se le inscribe a la NUEVA Categoría (se le notifica por mail)


*condiciones:
- Si hay Cupos disponibles
- Si cumple el rango de edad
- Si NO tiene otras disciplinas en el mismo horario y dia



Escenario 2: Cambiar de Categoría a un Alumno - Error

    Given: sesión activa Y pantalla MisDisciplinas
    
    When: selecciono un Alumno de una Categoría/Disciplina O un Alumno de todos mis alumnos Y le selecciono otra Categoría (donde NO cumple las condiciones)
    
    Then: msj indica cuáles condiciones NO cumple


Escenario 3: Desinscribir a un Alumno de una Categoría - Success

    Given: sesión activa Y pantalla MisDisciplinas
    
    When: selecciono un Alumno de una Categoría/Disciplina O un Alumno de todos mis alumnos Y selecciono DESINSCRIBIR
    
    Then: al Alumno se le desinscribe de la Categoría (se le notifica por mail)


### US 10 - Pantalla Gestión/Cuotas rol SuperAdmin-Secretaria

Como: Usuario SuperAdmin-Secretaria

Quiero: gestionar las Cuotas del Club

Para: para estar al día sobre las cuotas y deudores 



#### Criterios de aceptación BDD

Escenario 1: Marcar como pagada la Cuota SOCIAL de un Alumno (pago en efectivo) - Success

    Given: sesión activa Y pantalla Gestión/Cuotas 
    
    When: selecciono un Alumno/Cuotas Y marco una Cuota Social específica como pagada
  
    Then: se actualiza el estado de esa Cuota a PAGADA (se actualiza el listado de cuotas sociales del alumno)

Escenario 1: Marcar como pagada la Cuota SOCIAL de un Alumno (pago en efectivo) - Error

    Given: sesión activa Y pantalla Gestion/Cuotas 
    
    When: selecciono un Alumno/Cuotas Y marco una Cuota Social específica como pagada PERO no se pudo actualizar el estado
    
    Then: msj indica error en el servidor


Escenario 1: Ver Pagos de Cuota Social de los Alumnos - Success

    Given: sesión activa Y pantalla Gestion/Cuotas 
    
    When: selecciono Cuotas Sociales 
    
    Then: muestra en orden: Alumnos q NO pagaron el mes anterior (y anteriores), Alumnos q SI pagaron los anteriores meses

Escenario 2: Marcar como pagada la Cuota DISCIPLINA de un Alumno (pago en efectivo) - Success

    Given: sesión activa Y pantalla MisDisciplinas
    
    When: selecciono un Alumno/Cuotas Y marco una Cuota específica como pagada
    
    Then: se actualiza el estado de esa Cuota a PAGADA (se actualiza el listado de cuotas del alumno)


Escenario 3: Marcar como pagada la Cuota DISCIPLINA de un Alumno (pago en efectivo) - Error

    Given: sesión activa Y pantalla MisDisciplinas
    
    When: selecciono un Alumno/Cuotas Y marco una Cuota específica como pagada PERO no se pudo actualizar el estado
    
    Then: msj indica error en el servidor


### US 11 - Pantalla Gestión/KPIs e Informes rol SuperAdmin-Secretaria

Como: Usuario SuperAdmin-Secretaria

Quiero: consultar info Y generar informes

Para: para estar al día sobre la situación general del Club


#### Criterios de aceptación BDD

Escenario 1: Generar informe de (Disciplinas / Categorías / Notificaciones / Pagos / Usuarios) - Success

    Given: sesión activa y Pantalla Informes
    
    When: cuando entro a un KPI (Disciplina / Categoría / etc) y genero Informe (PDF o Excel)
    
    Then: se descarga el informe del KPI elegido en el formato indicado



Escenario 2: Generar informe de (Disciplinas / Categorías / Notificaciones / Pagos / Usuarios) - Error

    Given: sesión activa y Pantalla Informes
    
    When: cuando entro a un KPI (Disciplina / Categoría / etc) y genero Informe (PDF o Excel) Y no se puede generar 
    
    Then: msj indica el error de pq no se pudo generar 


### US 13 - Pantalla Gestión/Gestión de Usuarios rol SuperAdmin-Secretaria

Como: Usuario SuperAdmin-Secretaria

Quiero: gestionar Usuarios 

Para: modificar Usuarios existentes Y crear nuevos Usuarios (con roles exclusivos, ej: Profesor/Secretario)

 
#### Criterios de aceptación BDD

Escenario 1: Crear nuevo Usuario - Success

    Given: sesión activa Y pantalla Gestion/Usuarios 

    When: completo el form de Nuevo Usuario y su email NO está registrado 

    Then: se crea el Usuario correctamente y con una contraseña predeterminada

Escenario 1: Crear nuevo Usuario - Error

    Given: sesión activa Y pantalla Gestion/Usuarios

    When: completo el form de Nuevo Usuario y su email SI está registrado

    Then: msj indica q no se puede crear un Usuario con un email ya registrado 

 

Escenario 2: Modificar Usuario existente - Success

    Given: sesión activa Y pantalla Gestion/Usuarios

    When: completo el form de Modificar Usuario (no se puede cambiar el email)

    Then: se modifica el Usuario correctamente

Escenario 2: Modificar Usuario existente- Error

    Given: sesión activa Y pantalla Gestion/Usuarios

    When: completo el form de Modificar Usuario PERO no se pueden guardar los cambios 

    Then: msj indica el error del servidor 

 

Escenario 3: Eliminar Usuario existente - Success

    Given: sesión activa Y pantalla Gestion/Usuarios

    When: selecciono un Alumno Y toco eliminar

    Then: popup pide confirmación  (Cancelar: no hace nada, vuelve a la pantalla/Confirmar: elimina el Usuario)

 

Escenario 3: Eliminar Usuario existente- Error

    Given: sesión activa Y pantalla Gestion/Usuarios

    When: selecciono un Alumno Y toco eliminar PERO no se puede eliminar 

    Then: msj indica error del servidor 
