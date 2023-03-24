//main.js
let express = require('express');

var multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
   cb(null, 'public/');
  },
  filename: function (req, file, cb) {
   cb(null, Date.now() + '.png');
  }
 })
 
var upload = multer({ storage: storage })

let app = express()

app.use(express.static('public'))

app.post('/public/index.html',upload.single('myfile'),(req,res,next)=>{
  console.log(req.file)
//   multer({ storage: storage })
})

app.listen(3300,'127.0.0.1')