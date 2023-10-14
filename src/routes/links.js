const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/add', async (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res)=>{
    const { title, description } = req.body
    const NuevaNota = {
        title,
        description
    };
    await pool.query('INSERT INTO NotaDePrueba set ?', [NuevaNota]);
    req.flash('success', 'Nota agregada correctamente');
    res.redirect('/links');
})

router.get('/',  async (req, res)=>{
    const Notas = await pool.query('SELECT * FROM NotaDePrueba');
    console.log(Notas);
    res.render('links/list', {Notas :  Notas})
});

router.get('/delete/:ID_Nota', async (req, res)=>{
    const { ID_Nota } = req.params;
    await pool.query('DELETE FROM NotaDePrueba WHERE ID_Nota = ?', [ID_Nota]);
    req.flash('success', 'Removido exitosamente');
    res.redirect('/links')
});

router.get('/edit/:ID_Nota', async (req, res)=>{
    const { ID_Nota } = req.params;
    const Notas = await pool.query('SELECT * FROM NotaDePrueba WHERE ID_Nota = ?', [ID_Nota]);
    
    res.render('links/edit', {Notas: Notas[0]} );
});

router.post('/edit/:ID_Nota',  async(req, res)=>{
    const {ID_Nota } = req.params;
    const { title, description} = req.body;
    const newNota ={
        title,
        description
    };
    await pool.query('UPDATE NotaDePrueba set ? WHERE ID_Nota = ?', [newNota, ID_Nota]);
    req.flash('success', 'Edición completada')
    res.redirect('/links');
})

module.exports = router;