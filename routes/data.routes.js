const { Router } = require("express")
const router = Router()
const db = require('../db');
const os = require('os');
var fs = require('fs');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })



router.get('/', async (req, res) => {
    const last_id = parseInt(req.query.start) || 0
    const limit = parseInt(req.query.rows) || 20
    console.log("last id  " + last_id)
    const rows = []
    const headers = []
    const headersCount = 50;
    const nextLimit = last_id + limit

    for (let index = 0; index < headersCount; index++) {
        headers.push("Колонка #" + index)
    }



    if (last_id < 1) {
        for (let index = 0; index < limit; index++) {
            const cell = []
            for (let j = 0; j < headersCount; j++) {
                cell.push(index);
            }
            rows.push(cell)
        }
    } else {

        for (let index = last_id; index < nextLimit; index++) {
            const cell = []
            for (let j = 0; j < headersCount; j++) {
                cell.push(index);
            }
            rows.push(cell)
        }
    }
    console.log(nextLimit)
    res.json({
        headers: headers,
        rows: rows,
        lastId: nextLimit,
        hasMore: 1000000 >= limit ? true : false
    });
})

router.get('/all', async (req, res) => {
    const rows = []
    const headers = []
    const headersCount = 50;
    for (let index = 0; index < headersCount; index++) {
        const header = {
            field: `${index}`,
            headerName: `Колонка ${index}`,
        }
        headers.push(header)
    }
    for (let index = 0; index < 100000; index++) {
        const cell = {
            id: index
        }
        for (let j = 0; j < headersCount; j++) {
            cell[`${headers[j].field}`] = `${index}`
        }
        rows.push(cell)
    }
    res.json({
        headers: headers,
        rows: rows,
    });
})

module.exports = router
