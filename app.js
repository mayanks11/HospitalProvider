require('dotenv').config();
const express= require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const mongoose =require("mongoose");
// const encrypt =require("mongoose-encryption");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const md5 =require("md5")

const app= express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

var con1= mongoose.createConnection("mongodb://localhost:27017/patientDetails");
var con2= mongoose.createConnection("mongodb://localhost:27017/doctorDetails");
var con3= mongoose.createConnection("mongodb://localhost:27017/departmentDetails");
var con4 = mongoose.createConnection("mongodb://localhost:27017/LoginDatabase");
// Cilic Schema
const DeparmentSchema ={
    deparmentName: String,
    deparmentHead: String,
    departmentArea:String,
    deparmentEmployment: Number
}
// Patient Schema

const PatientSchema ={
   patientName:String,
   patientAge:Number,
   patientSex:String,
   patientBldgp:String,
   patientDisease:String,
   patientArea:String,
   patientEmail:String,
   patientNumber:Number
   
};
// Patient Schema
const DoctorSchema ={
    doctorName :String,
    doctorSpecilization :String, 
    YearofExperience :Number,
    doctorPhoneno :Number,
    doctorArea: String,
   
};


const Patient=con1.model("Patient",PatientSchema);
const Doctor=con2.model("Doctor",DoctorSchema);
const Deparment=con3.model("Deparment",DeparmentSchema);

// User Schema
const userSchema= new mongoose.Schema({
    
    email: String,
    password:String
});

userSchema.plugin(passportLocalMongoose);

 const User=con4.model("User",userSchema);

 passport.use(User.createStrategy());

 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
    res.render("main");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/About",function(req,res){
    Patient.find({},function(err,patient){
        Doctor.find({},function(err,doctors){
            Deparment.find({},function(err,departs){
                res.render("admin",{pats:patient,dots:doctors,dets:departs});
            });
        });
    });
});

app.get("/register",function(req,res){
    
    res.render("register");
});


app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

app.get("/succes",function(req,res){
    if (req.isAuthenticated()){    
    Patient.find({},function(err,patient){
        Doctor.find({},function(err,doctors){
            Deparment.find({},function(err,departs){
                User.find({},function(err,user){
                    res.render("succes",{pats:patient,dots:doctors,dets:departs,user:user});
            });
        });
    });
});
}else{
    res.redirect("/login");
}

});


app.post("/register",function(req,res){
    User.register({username: req.body.username}, req.body.password, function(err,user){
        if (err) {
            try{
                res.render("errors",{error:err});
            }
            catch(err){
                res.send(err.message);
            }            
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("patientForm");
            });
        }

    }); 
});
  
app.post("/login",function(req,res){
    const user = new User({
        username: req.body.username,
        password: req.body.password 
    });
    req.login(user,function(err){
        if (err){
            console.log(err);           
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("succes");
            });

        }
    });
 });

// Inside the hospital provider
app.get("/admin",function(req,res){
    res.render("Aboutus");
});
app.get("/LisDoc",function(req,res){
    Patient.find({},function(err,patient){
        Doctor.find({},function(err,doctors){
            Deparment.find({},function(err,departs){
                res.render("Doctor",{pats:patient,dots:doctors,dets:departs});
            });
        });
    }); 
});
app.get("/Lisclinic",function(req,res){
    Patient.find({},function(err,patient){
        Doctor.find({},function(err,doctors){
            Deparment.find({},function(err,departs){
                res.render("clinic",{pats:patient,dots:doctors,dets:departs});
            });
        });
    }); 
});
app.get("/Lispatient",function(req,res){
    Patient.find({},function(err,patient){
        Doctor.find({},function(err,doctors){
            Deparment.find({},function(err,departs){
                res.render("patient",{pats:patient,dots:doctors,dets:departs});
            });
        });
    }); 
});
app.get("/patientForm",function(req,res){       
    res.render("patientForm");
});


app.post("/patientForm",function(req,res){
    const NewPatient= new Patient({
        patientName: req.body.patName,
        patientAge: req.body.patAge,
        patientSex: req.body.patSex,
        patientBldgp: req.body.patBlood,
        patientDisease: req.body.patDisease,
        patientArea: req.body.state,
        patientEmail: req.body.patEmail,
        patientNumber: req.body.patNumber       
    });
    console.log(NewPatient);
    NewPatient.save();
    res.redirect("succes");
});
app.get("/patient",function(req,res){
    res.render("patient")
});

app.post("/docForm",function(req,res){
    const newDoctor = new Doctor({
        doctorName: req.body.dname,
        doctorSpecilization: req.body.spec,
        YearofExperience: req.body.year,
        doctorPhoneno: req.body.phone,
        doctorArea: req.body.state
    });
    // console.log(newDoctor);
    newDoctor.save();
    res.redirect("/Doc");
});
app.get("/Doc",function(req,res){
    res.render("doctorForm");
});
app.get("/departmentForm",function(req,res){
    res.render("reacherDept");
});
app.post("/reacherDept",function(req,res){
    const newDepartment = new Deparment({
        deparmentName: req.body.deptname,
        deparmentHead: req.body.deptname,
        departmentArea: req.body.state,
        deparmentEmployment: req.body.empl
    });
    console.log(newDepartment);
    newDepartment.save();
    res.redirect("/departmentForm");
    
});
app.post("/delete",function(req,res){
    // const Doctorcheck=req.body.checkbox
    console.log(); 
    Doctor.findByIdAndRemove(Doctorcheck,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Successfully remove the item");
            res.redirect("/admin") 
        }

    })
     
});


 app.listen(process.env.PORT|| 2000,function(){
     console.log("Server is running on port 2000");
 });
