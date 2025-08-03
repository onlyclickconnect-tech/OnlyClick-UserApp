import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import OTPButton from '../../../components/OTP/OTPButton';
import OTPDisplay from '../../../components/OTP/OTPDisplay';
import OTPHeader from '../../../components/OTP/OTPHeader';
import OTPResend from '../../../components/OTP/OTPResend';

export default function OTP() {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(39);
  const [activeIndex, setActiveIndex] = useState(0);
  const otpInputRef = useRef(null);

  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      otpInputRef.current?.focus();
    }, 100);
    
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(focusTimeout);
    };
  }, []);

  const handleSubmit = () => {
    if (otp.length === 4) {
      router.replace('/auth/loading');
    }
  };

  const handleOtpChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '').slice(0, 4);
    setOtp(cleanedText);
    setActiveIndex(cleanedText.length < 4 ? cleanedText.length : 3);
    
    if (cleanedText.length === 4) {
      setTimeout(() => {
        handleSubmit();
      }, 100);
    }
  };

  const handleResend = () => {
    if (countdown === 0) {
      setCountdown(39);
    }
  };

  return (
    <View style={styles.container}>
      <OTPHeader />
      
      <View style={styles.content}>
        <OTPDisplay 
          otp={otp}
          activeIndex={activeIndex}
          inputRef={otpInputRef}
          onOtpChange={handleOtpChange}
        />
        
        <OTPResend 
          countdown={countdown}
          onResend={handleResend}
        />
        
        <OTPButton 
          otpLength={otp.length}
          onSubmit={handleSubmit}
        />
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },
};