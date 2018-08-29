function apiResponse (res,code,message,success,data) {
    res.status(code).send({success: success, message: message,data:data});
}

module.exports = {
    validationErrorResponse: (req,res,error) => {
        let message = '';
        error.map(function(value){
            message += value.msg+' ';
        });
        apiResponse(res,422,message,false);
    },
    sendServerError: (req,res,err,code) => {
        apiResponse(res,code,err,false)
    },
    sendSuccess: (req,res,data,message) => {
        apiResponse(res,302,message,true,data)
    }
};