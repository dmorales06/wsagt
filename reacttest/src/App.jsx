import {BrowserRouter, Routes, Route} from 'react-router-dom';

//alertas de componentes
import { AlertProvider } from './utils/utilsAlerts'; // asegúrate que esto existe
import { AlertComponent } from './components/AlertComponent';

//vistas
import { ViewLogin } from './views/viewLogin';
import {Ticket} from "./views/TicketDetail";


export function App (){
    return (

        //<User nombre={"Diego"} apellido={"Morales"} correo={"dmorales@genesisempresarial.com"} rol={"ADMIN"} puesto={"IT"} permisos={permisos}/>
        <AlertProvider>
            <AlertComponent />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ViewLogin />} />
                    <Route path="/home" element={<Ticket />} />
                </Routes>
            </BrowserRouter>
        </AlertProvider>
    )
}