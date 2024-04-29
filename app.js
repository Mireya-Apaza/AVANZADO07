const express = require('express');
const mongoose = require('mongoose');
const app = express();
mongoose.connect('mongodb://localhost:27017/databasemusic', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error(error);
});

const userSchema = new mongoose.Schema({
  nombre: String,
  genero: String,
  artista: String
});
const User = mongoose.model('User', userSchema);

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/', (req, res) => {
  const newUser = new User({
    nombre: req.body.nombre,
    genero: req.body.genero,
    artista: req.body.artista
  });

  newUser.save()
    .then(() => {
      res.redirect('/datos');
    })
    .catch((error) => {
      res.status(500).send('Error al guardar los datos');
      console.error('Error creating user:', error);
    });
});

app.get('/datos', async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.render('datos', { message: 'No hay datos disponibles' });
    }
    res.render('datos', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los datos');
  }
});

app.listen(9090, () => {
  console.log('Server is running on port 9090');
});