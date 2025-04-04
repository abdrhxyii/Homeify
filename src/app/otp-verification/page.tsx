'use client';
import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";

export default function OtpPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const handleChange = (element: any, index: any) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to the next input box
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleResend = () => {
    setTimer(60);
    setResendDisabled(true);
    // Trigger resend OTP logic here
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");
    console.log("Entered OTP:", enteredOtp);
    // Add verification logic here
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Enter OTP Sent to mmarahman4847@gmail.com
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="block w-10 h-10 rounded-md bg-white text-center text-xl text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                disabled={resendDisabled}
                onClick={handleResend}
                className={`text-sm font-semibold ${
                  resendDisabled ? "text-gray-400" : "text-primary"
                }`}
              >
                Resend OTP {resendDisabled && `in ${timer}s`}
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={handleVerify}
                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Verify OTP
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
