import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const OTPResend = ({ countdown, onResend }) => {
  return (
    <TouchableOpacity onPress={onResend} style={styles.resendContainer}>
      <Text style={[
        styles.resendText,
        countdown === 0 && styles.resendActiveText
      ]}>
        {countdown > 0 ? `Resend OTP after: ${countdown} sec` : 'Resend OTP now'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resendContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 15,
    fontWeight: '500',
  },
  resendActiveText: {
    color: '#3898B3',
    textDecorationLine: 'underline',
  },
});

export default OTPResend;