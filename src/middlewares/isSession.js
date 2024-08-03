
export const isSession =(req, res, next)=>{
    const isSession =  req.session.user ? false : true; 
    if(! isSession){
        return res.redirect("/");
    }
    next();
}