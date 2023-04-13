const { Router } = require("express")
const Excel = require("exceljs")
const router = Router()
const db = require('../db');

var fs = require('fs');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })



///api/excel/hello

router.post('/upload', upload.single('file'), async (req, res) => {

	const result = { headers: [], rows: [] }
	const workbook = new Excel.Workbook();
	await workbook.xlsx.load(req.file.buffer);

	const worksheet = workbook.getWorksheet(1);
	const row = worksheet.getRow(4);
	row.eachCell(function (cell, colNumber) {
		result.headers.push(cell.value)
		console.log('Cell ' + colNumber + ' = ' + cell.value);
	});


	for (let i = 5; i <= 40; i++) {
		const row = worksheet.getRow(i);
		const cellsArray = []
		row.eachCell(function (cell, colNumber) {
			cellsArray.push(cell.value);
			console.log('Cell ' + colNumber + ' = ' + cell.value);
		});
		if (cellsArray !== null) result.rows.push(cellsArray)
	}
	console.log(result);

	res.status(201).json({ message: result })
})

router.get('/generate', async (req, res) => {
	const baseFile = "template.xlsx";
	let wb = new Excel.Workbook();
	wb.xlsx
		.readFile(baseFile)
		.then(async function () {
			// add data to template
			const worksheet = wb.getWorksheet(1);
			const row = worksheet.getRow(1);
			row.getCell(1).value = "Это изменение"
			await wb.xlsx.writeFile("result.xlsx")
			res.download("result.xlsx", { dotfiles: "deny" }, function (err) {
				fs.unlinkSync("result.xlsx");
			});

		})
		.catch((err) => {
			console.log(err)
			res.status(500).json({ message: err })
		});

})






module.exports = router
