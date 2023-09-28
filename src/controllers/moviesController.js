const { validationResult } = require('express-validator');
const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment');
const { asIs } = require('sequelize');

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        return res.render('moviesAdd')  
    },

    create: function (req, res) {
        let errors = validationResult(req)

        if(errors.isEmpty()){
        const {title, rating, awards,release_date,length} = req.body
        db.Movie.create({
            title: title.trim(),
            rating,
            awards,
            release_date,
            length

        })
            .then(movie => {
                console.log(movie);
                return res.redirect('/movies')
            })
            
    }else{
    
        return res.render('moviesAdd', {
            old : req.body,
            errors : errors.mapped()
        })
    }
    
},
    edit: function(req, res) {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                
                return res.render('moviesEdit',{
                    Movie : movie,
                    moment
                })
            })
            .catch(error => console.log(error))
    },
    update: function (req,res) {

        let errors = validationResult(req)

        if(errors.isEmpty()){
        const {title, rating, awards,release_date,length} = req.body
        db.Movie.update(
            {
            title: title.trim(),
            rating,
            awards,
            release_date,
            length
        },
        {
            where : {
                id : req.params.id
            }
        }
        ).then(response => {
            console.log(response);
            db.Movie.findByPk(req.params.id)
                .then(movie => {
                    return res.render('moviesDetail',{
                        movie
                    })
                })
        })
    }else{
        return res.render('moviesDetail', {
            old : req.body,
            errors : errors.mapped()
        })
    }
        

        
        
    },
    delete: async function (req, res) {
        const movie = await db.Movie.findByPk(req.params.id)
        res.render("moviesDelete",{
            Movie:movie
        })
    },
    destroy: function (req, res) {
    
        db.Movie.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(() => {

            res.redirect('/movies');
        })
        .catch(error => {
            console.error('Error al eliminar la película:', error);
            
            res.redirect('/movies'); 
        });
    }
    

}

module.exports = moviesController;