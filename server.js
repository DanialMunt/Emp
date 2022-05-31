const express = require('express')
const path = require("path");
const bodyParser = require('body-parser');
const helmet = require("helmet");
const cookieparser = require('cookie-parser')
const mongoose = require('mongoose');
const app = express()
const port = process.env.PORT || 8000
const url = 'mongodb+srv://danial:danial@cluster0.f59bb.mongodb.net/empire'

app.use(express.static('InternshipSite'));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/InternshipSite/views"));

app.use(helmet());
app.use(cookieparser());


app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: true}));

/*mongoose.connect('mongodb+srv://danial:danial@cluster0.f59bb.mongodb.net/empire', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


const notesSchema = {
    email: String,
    password: String
}

const Note = mongoose.model("Note", notesSchema);*/

const {MongoClient} = require('mongodb');

let mongoClient = new MongoClient(url, {
    useUnifiedTopology: true
});


// app.post('/sign_up', function(req, res) {
//     /*let newNote = new Note({
//         email: req.body.email,
//         password: req.body.password
//     });*/
//
//     let x = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{7,}$/
//     if (!req.body.password.match(x)){
//         return res.status(409).send('invalid pass')
//     }
//
//     //newNote.save();
//     res.redirect('/')
// })

/*mongoClient.connect(async function(error, mongo) {
    const db = mongo.db('empire')
    console.log('Connected to Database')
    app.get('/', (req, res) => {
       let results = db.collection('notes').find().toArray()
            .then(results => {
                console.log(results)
            })
            .catch(error => console.error(error))
    })
});*/


mongoClient.connect(async function(error, mongo) {

        let db = mongo.db('empire');
        let coll = db.collection('notes');

    /*app.get("/welcome", async (req, res) => {
        let user = req.body.email;
        res.render("welcome", {
            user
        });
    })*/
    app.get('/user_cv', async (req, res) => {
        res.render('user_cv',);
    })


    app.post('/user_cv', async (req, res) =>{
        let qq = await coll.findOneAndUpdate({ email: req.cookies.email},
            {
                $set: {
                    "phone": req.body.phone,
                    "city": req.body.city,
                    "career": req.body.career,
                    "salary": req.body.salary,
                    "about": req.body.about,
                    "key": req.body.key,
                    "education": req.body.education,
                    "extra": req.body.extra
                }
            }

        )
        res.clearCookie("email");
        res.redirect('/');
    })


    app.post('/sign_up', async (req, res) =>{

        //let x = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{7,}$/

        // if (!req.body.password.match(x)){
        //     return res.status(409).send('invalid pass')
        // }
        await coll.insertOne({email: req.body.email, password: req.body.password})
        res.cookie("email", req.body.email);

        res.redirect('/user_cv');
    })

    app.get("/welcome", async (req, res) => {
        let user = req.cookies.username;
        let interns = await db.collection('employer').find().toArray();


        res.render('welcome',{
            user, interns
        });

    });

    app.post("/profile/update", async (req, res) => {
        if (req.body.email != "" && req.body.about != "") {
            await coll.updateOne(
                { email: req.cookies.username },
                {
                    $set: {
                        email: req.body.email,
                        about: req.body.about,
                    }
                }
            )

        }
        else {
            console.log("nothing")
        }
        res.redirect('/profile')
    });

    app.get("/profile", async (req, res) => {
        let user = req.cookies.username;
        let cv = await coll.find({email: req.cookies.username}).toArray()


        res.render('profile',{
            user, cv
        });

    });

    // app.get('/search', async (req,res)=>{
    //
    //     await db.collection('employer').find({$text: {$search: req.query.dsearch}})
    //     console.log()
    //     res.render('search', {
    //         user, cv, interns });
    // });

    app.get("/intern/:email", async (req, res) => {

        let show = await db.collection('employer').find({email: req.params.email}).toArray();
        res.render('intern',{
            show
        });
    });

    // ТОТ САМЫЙ APPLY_CV: EMAIL С КОТОРЫМ ТРУДНОСТИ

    app.get('/apply_cv/:email', async (req, res) =>{
        let employer = await db.collection('employer').find({email: req.params.email}).toArray();
        let ay = await coll.find({email: req.cookies.username}).toArray();
        let yo =
        // let new_col = await db.createCollection("emp:email",
        //     {
        //         "phone": req.body.phone,
        //         "city": req.body.city,
        //         "career": req.body.career,
        //         "salary": req.body.salary,
        //         "about": req.body.about,
        //         "key": req.body.key,
        //         "education": req.body.education,
        //         "extra": req.body.extra
        //     })
        console.log(employer)
        console.log(ay)

        app.get("/cv_respons", async (req, res) => {
            res.render('cv_respons',{
                ay
            });
        });

        res.redirect('/welcome');

    })

    // app.get("/cv_respons", async (req, res) => {
    //     res.render('cv_respons',{
    //
    //     });
    // });


    // app.get('/admin/delete/:email', async (req, res) =>{
    //
    //     await coll.deleteOne({email: req.params.email});
    //     res.redirect('/admin');
    // })

    // app.get('/admin', async (req, res) => {
    //     let user = await coll.find().sort({email: 1}).toArray();
    //     console.log(user);
    //     //res.send(user)
    //     res.render('admin',{
    //         user
    //     });
    //
    // })

    app.post('/sign_in', async (req, res) => {
        try {
            let userdetails = {
                username: "moderator@mail.ru",
                password: "Dan1234!!",
            };

            if (req.body.email === userdetails["username"] &&
                req.body.password === userdetails["password"]) {
                res.redirect('/admin')
            }
            let correctData = await coll.findOne({ email : req.body.email, password : req.body.password })
            console.log(correctData);
            if (!correctData) {
                return res.status(401).send('Email or password is not correct!')
            }
            res.cookie("username", req.body.email);
            res.redirect('/welcome')

        }
        catch (err) {
            console.log(err)
        }

    })



    app.post('/admin', async (req, res) => {

        if (req.body.search != "" && req.body.password != "" && req.body.email != "") {
            await coll.findOneAndUpdate(
                { email: req.body.search },
                {
                    $set: {
                        email: req.body.email,
                        password: req.body.password,
                    }
                }
            )
        }
        else {
            console.log("nothing")
        }
        await coll.deleteOne({email: req.body.delete})
        res.redirect('/admin')
    })

    app.get('/admin/delete/:email', async (req, res) =>{

        await coll.deleteOne({email: req.params.email});
        res.redirect('/admin');
    })

    app.post('/admin/create', async (req, res) =>{
        await coll.insertOne({email: req.body.email, password: req.body.password})
        res.redirect('/admin');
    })


    app.get('/admin', async (req, res) => {
        let user = await coll.find().sort({email: 1}).toArray();
        console.log(user);
        //res.send(user)
        res.render('admin',{
            user
        });

    })

    app.get("/logout", (req, res) => {

        res.clearCookie("username");

        return res.redirect("/");
    });





});

mongoClient.connect(async function(error, mongo) {

    let db = mongo.db('empire');
    let coll = db.collection('employer');

    app.get('/sign_up_emp', async (req, res) => {
        res.render('sign_up_emp',);
    })

    app.get('/sign_in_emp', async (req, res) => {
        res.render('sign_in_emp',);
    })

    app.get('/job', async (req, res) => {
        res.render('job',);
    })


    app.post('/job', async (req, res) =>{
        await coll.findOneAndUpdate({ email: req.cookies.email},
            {
                $set: {
                    "company": req.body.company,
                    "position" : req.body.position,
                    "desc": req.body.desc,
                    "respons": req.body.respons,
                    "requirements": req.body.requirements,
                    "schedule": req.body.schedule,
                    "terms": req.body.terms,
                }
            }

        )
        res.clearCookie("email");
        res.redirect('/');
    })



    app.post('/sign_up_emp', async (req, res) =>{

        //let x = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{7,}$/

        // if (!req.body.password.match(x)){
        //     return res.status(409).send('invalid pass')
        // }
        await coll.insertOne({email: req.body.email, password: req.body.password})
        res.cookie("email", req.body.email);

        res.redirect('/job');
    })

    app.get("/welcome_emp", async (req, res) => {
        let user = req.cookies.username;
        let job = await coll.find({email: req.cookies.username}).toArray()

        res.render('welcome_emp',{
            user, job
        });

    });

    app.post('/sign_in_emp', async (req, res) => {
        try {
            // let userdetails = {
            //     username: "moderator@mail.ru",
            //     password: "Dan1234!!",
            // };
            //
            // if (req.body.email === userdetails["username"] &&
            //     req.body.password === userdetails["password"]) {
            //     res.redirect('/admin')
            // }

            let correctDataEmp = await coll.findOne({
                email : req.body.email,
                password : req.body.password })

            console.log(correctDataEmp);

            if (!correctDataEmp) {
                return res.status(401).send('Email or password is not correct!')
            }
            res.cookie("username", req.body.email);
            res.redirect('/welcome_emp')

        }
        catch (err) {
            console.log(err)
        }

    })




    app.get("/logout", (req, res) => {

        res.clearCookie("username");
        return res.redirect("/");
    });




});


app.get('/sign_up', (req, res)  => {
    res.sendFile(__dirname + '/InternshipSite/sign_up.html')
})


app.get('/sign_in', (req, res)  => {
    res.sendFile(__dirname + '/InternshipSite/sign_in.html')
})


/*mongoClient.connect(async function(error, mongo) {
    if (!error) {
        let db = mongo.db('mongodb');
        let coll = db.collection('users');
        //await coll.deleteOne({cost:300});

        let res = await coll.find({
            "langs.1":"spanish"

    }).toArray();
        console.log(res);
    } else {
        console.error(err);
    }
});*/





app.use('/CSS', express.static(__dirname+'/InternshipSite/CSS'))


app.get('/', (req, res)  => {
    res.sendFile(__dirname + '/InternshipSite/index.html')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})