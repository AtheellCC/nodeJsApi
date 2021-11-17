const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const https = require('https');
const app = express();
const fs = require('fs');


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// MySQL
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : '',
    user            : '',
    password        : '',
    database        : ''
})
// Authentication User And Password
app.use((req, res, next) => {
    const auth = {login: 'username', password: 'BDG335acDJ245FA($WJES26cea5fewijf98-09=w-0=e--0==2rfekd'} 
     const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
      const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
       if (login && password && login === auth.login && password === auth.password) {
        return next()
      }
      res.set('WWW-Authenticate', 'Basic realm="401"')
      res.status(401).send('Authentication Failed Please Try Again.')
    })
    

// Get all beers
app.get('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT`id`, `primary_did`, `primary_maxtrails`, `primary_delay`,  `secondary_did`, `secondary_maxtrails`, `secondary_delay`, `call_maxduration`, `remote_string` FROM `phonenumbers`', (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
})


// Get a beer by ID
app.get('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)
        
        connection.query('SELECT`id`, `primary_did`, `primary_maxtrails`, `primary_delay`,  `secondary_did`, `secondary_maxtrails`, `secondary_delay`, `call_maxduration`, `remote_string` , `call_status`  FROM `phonenumbers` WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
})

// Delete a records / beer
app.delete('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('DELETE from phonenumbers WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`Beer with the Record ID: ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }

        })
    })
})


// Add a record / beer
app.post('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { id , primary_did, primary_maxtrails, primary_delay, secondary_did , secondary_maxtrails , secondary_delay, call_maxduration , remote_string } = req.body

        connection.query('INSERT INTO phonenumbers SET id = ? , primary_did = ?, primary_maxtrails = ? , primary_delay = ?, secondary_did = ? , secondary_maxtrails = ? , secondary_delay = ? , call_maxduration = ? , remote_string = ?', [ id , primary_did, primary_maxtrails, primary_delay, secondary_did , secondary_maxtrails , secondary_delay, call_maxduration , remote_string  ] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(req.body);
            } else {
                console.log(err)
                res.send(err);
            }

        })

        console.log(req.body)
    })
})


// Update a record / beer
app.put('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { id, name, tagline, description, image } = req.body

        connection.query('UPDATE beers SET name = ?, tagline = ?, description = ?, image = ? WHERE id = ?', [name, tagline, description, image, id] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`Beer with the name: ${name} has been added.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})



// Listen on enviroment port or 5000
app.get('ss', (req, res) => {
    res.send('Hello HTTPS!')
    })
    
        
    https.createServer({
      key: fs.readFileSync('certs/atheelcc.com.key'),
      cert: fs.readFileSync('certs/STAR_atheelcc_com.crt')
      }, app).listen(4333, () => {
      console.log('Listening… to localhost https://cpapi.atheelcc.com:8090 AND Out https://cpapi.atheelcc.com')
      })
  
