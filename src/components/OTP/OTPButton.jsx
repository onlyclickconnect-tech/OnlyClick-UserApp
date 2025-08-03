import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const OTPButton = ({ otpLength, onSubmit }) => {
  return (
    <TouchableOpacity
      style={[
        styles.proceedButton,
        otpLength < 4 && styles.disabledButton,
      ]}
      onPress={onSubmit}
      disabled={otpLength < 4}
      activeOpacity={0.8}
    >
      <Text style={styles.proceedButtonText}>PROCEED</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  proceedButton: {
    backgroundColor: '#3898B3',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  proceedButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default OTPButton;