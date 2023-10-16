const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');


router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add',{
        title: 'holaaaa',
        style: 'styles.css'
    });
});

router.post('/add', isLoggedIn, async (req, res)=>{
    const { taskname, body_task, duedate } = req.body
    const NuevaNota = {
        taskname,
        body_task,
        duedate,
        ID_User:req.user.ID_User
    };
    await pool.query('INSERT INTO task set ?', [NuevaNota]);
   // req.flash('success', 'Nota agregada correctamente');
    res.redirect('/links');
})

router.get('/', isLoggedIn, async (req, res)=>{
    const Notas = await pool.query('SELECT * FROM task WHERE ID_User = ?', [req.user.ID_User]);
    console.log(Notas);
    res.render('links/list', {Notas :  Notas})
});

router.get('/delete/:id_task',isLoggedIn, async (req, res)=>{
    const { id_task } = req.params;
    await pool.query('DELETE FROM task WHERE id_task = ?', [id_task]);
    //req.flash('success', 'Removido exitosamente');
    res.redirect('/links')
});

router.get('/edit/:id_task', isLoggedIn, async (req, res)=>{
    const { id_task } = req.params;
    const Notas = await pool.query('SELECT * FROM task WHERE id_task = ?', [id_task]);
    
    res.render('links/edit', {Notas: Notas[0]} );
});

router.post('/edit/:id_task', isLoggedIn, async(req, res)=>{
    const {id_task } = req.params;
    const { taskname, body_task, duedate} = req.body;
    const newNota ={
        taskname,
        body_task,
        duedate,
    };
    await pool.query('UPDATE task set ? WHERE id_task = ?', [newNota, id_task]);
   // req.flash('success', 'Edición completada')
    res.redirect('/links');
})

module.exports = router;