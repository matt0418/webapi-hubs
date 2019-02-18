const express = require('express');

const db = require('./data/db')

const server = express()

server.use(express.json())

const today = new Date().toLocaleDateString()
const time = new Date().toLocaleTimeString()


server.get('/', (req, res) => {
    res.send('Hello World')
})

server.get('/now', (req, res) => {
    res.send(today + '  ' + time)
})



//R in CRUD
server.get('/hubs', (req, res) => {
    // const hubs = db.hubs
    db.hubs
        .find()
        .then(hubs => {
            res.status(200).json(hubs)
        })
        .catch(({code, message}) => {
            res.status(code).json({
                success: false,
                message
            })
        })
})

server.get('/hubs/:id', (req ,res) => {
    const id = req.params.id
    db.hubs
        .findById(id)
        .then((hub) => {
            if (hub) {
                res.status(200).json({success: true, hub})
            } else {
                res.status(404).json({suceess: false, message: "I cannot find ID"})
            }
        })
        .catch(({code, message}) => {
            res.status(code).json({
                success: false,
                message
            })
        })
})

//C in CRUD
// server.post('/hubs', (req, res) => {
//     const hubInfo = req.body
//     db.hubs
//         .add(hubInfo)
//         .then(hub => {
//             res.status(201).json({ success: true, hub })
//         })
//         .catch((code, message) => {
//             res.status(code).json({
//                 success: false,
//                 message
//             })
//         })
// })

server.post('/hubs', (req, res) => {
    const hubInfo = req.body

    db.hubs
    .add(hubInfo)
    .then(hub => {
        res.status(201).json({success: true, hub})
    })
    .catch(({ code, message }) => {
        res.status(code).json({
          success: false,
          message,
        })
      })
})

server.delete('/hubs/:id', (req,res) => {
    const id = req.params.id
    db.hubs
    .remove(id)
    .then(deleted => { //deleted doesn't have to be there, can be left as an open parameter
        res.status(204).end()
    })
    .catch(({ code, message }) => {
        res.status(code).json({
          success: false,
          message,
        })
      })
})

//U in CRUD

server.put('/hubs/:id', (req, res) => {
    const {id} = req.params
    const changes = req.body
    db.hubs
        .update(id, changes)
        .then(updated => {
            if (updated) {
                res.status(200).json({success: true, updated})
            } else {
                res.status(404).json({suceess: false, message: "I cannot find ID"})
            }
        })
        .catch(({ code, message }) => {
            res.status(code).json({
              success: false,
              message,
            })
          })
})

server.listen(4000, () => {
    console.log(`\n*** Server Running on http://localhost:4000 ***\n`)
})