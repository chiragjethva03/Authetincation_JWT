
const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;    
}

const final = generateOtp();
module.exports = final;

