import {poolAGT} from "../DBS/conectionBD_mysql.js";

const controller = {};

//Obtener areas de empresa
controller.area = async (req, res) => {
    const [departametno] = await poolAGT.query('select * from departamento');
    res.json(departametno);
}

//Obtener area de empresa por ID
controller.areaID = async (req, res) => {
    const [areas] = await poolAGT.query('select * from departamento');
    const area = areas.find(c => c.id_departamento === parseInt(req.params.id));
    if (!area) return res.status(404).json({msg: 'Departamento no encontrado'});
    else res.json(area);
}

export default controller;