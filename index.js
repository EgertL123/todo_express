const express = require('express')
const app = express()
const fs = require('node:fs')


const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const readFile = (filename) => {
    return new Promise((resolve,reject) => {
        fs.readFile(filename, 'utf-8', (error,data) => {
            if (error) {
                console.error(error);
                return;
            }  
            const tasks = JSON.parse(data)
            resolve(tasks)
        });
    })
}
const writeFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, 'utf-8', error => {
            if (error) {
                console.error(error);
                return;
            }
            resolve(true)
        })
    })
}
app.get('/', (req,res) => {
    const editTaskId = parseInt(req.query.editTaskId) || null; 
    readFile('./tasks.json').then(tasks => {
        res.render('index', {
        tasks: tasks,
        error: null,
        editTaskId: editTaskId 
        });
    });
})

app.use(express.urlencoded({extended:true}))

app.post('/', (req, res) => {
    let error = null
    if (req.body.task.trim().length == 0) {
        error = 'Please insert correct task data'
        readFile('./tasks.json')
        .then(tasks => {
            res.render('index', {
                tasks: tasks,
                error: error
            })
        })
    } else {
    readFile('./tasks.json',)
        .then((tasks) => {
            let index
            if (tasks.length === 0 ){
                index = 0
            } else {
                index = tasks [tasks.length - 1].id + 1
            }
            const newTask = {
                "id":index,
                "task": req.body.task
            }
            tasks.push(newTask)
            data = JSON.stringify(tasks, null, 2)
            writeFile ('./tasks.json', data)
            res.redirect('/')
            })
        } 
    })
app.get('/delete-task/:taskid', (req, res) => {
    let deletedTaskId = parseInt (req.params.taskid)
        readFile('./tasks.json')
        .then(tasks => {
            tasks.forEach((task, index) => {
                if(task.id === deletedTaskId) {
                    tasks.splice(index, 1)
                }
            })
            data = JSON.stringify(tasks, null, 2)
            writeFile ('./tasks.json', data)
                res.redirect('/')
            })
    })

app.get('/delete-tasks', (req,res) => {
    data = JSON.stringify([],null, 2)
    writeFile ('./tasks.json', data)
    res.redirect('/')
})
app.post('/edit-task/:taskid', (req, res) => {
    const taskId = parseInt(req.params.taskid);
    const updatedTaskName = req.body.task.trim();

    if (updatedTaskName.length === 0) {
        return res.redirect(`/edit-task/${taskId}`);
    }

    readFile('./tasks.json').then(tasks => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.task = updatedTaskName;
            const data = JSON.stringify(tasks, null, 2);
            writeFile('./tasks.json', data).then(() => {
                res.redirect('/');
            });
        } else {
            res.redirect('/');
        }
    });
});


app.listen(3001, () =>{
    console.log('Server started at http://localhost:3001')
} )