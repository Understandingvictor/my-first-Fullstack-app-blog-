const isLoggedIn = async(req, res, next)=>{
    try {
        return res
        .json(
            {
                logged:true,
                message:"logged in successfully"
            }
        );
        }
     catch (error) {
        console.log("error happened on the islogged in controller");
        next(error);
     }
    
}
export  {isLoggedIn};