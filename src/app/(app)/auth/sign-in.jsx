import { router } from 'expo-router';
import { useState } from 'react';
import { StatusBar, View } from 'react-native';
import SignInFooter from '../../../components/SignIn/SignInFooter';
import SignInForm from '../../../components/SignIn/SignInForm';
import SignInHeader from '../../../components/SignIn/SignInHeader';
import SignInIllustration from '../../../components/SignIn/SignInIllustration';

//  api imports
import { sendOtp } from '../../../services/api/otp.api.js';

export default function SignIn() {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const formatPhoneNumber = (text) => {
        const digits = text.replace(/\D/g, '');
        const limitedDigits = digits.slice(0, 10);
        if (limitedDigits.length > 5) {
            return limitedDigits.slice(0, 5) + ' ' + limitedDigits.slice(5);
        }
        return limitedDigits;
    };

    const handlePhoneChange = (text) => {
        const formatted = formatPhoneNumber(text);
        setPhone(formatted);
        if (error) setError('');
    };

    const handleSignIn = async () => {
        const rawPhone = phone.replace(/\s/g, '');
        if (rawPhone.length < 10) {
            setError('Please enter a complete 10-digit mobile number');
            return;
        }
        setIsLoading(true);
        try {
            await sendOtp(rawPhone);
            router.push({ pathname: '/auth/otp', params: { phone: rawPhone } });
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <SignInHeader />
            <SignInIllustration />
            <SignInForm 
                phone={phone}
                error={error}
                onPhoneChange={handlePhoneChange}
                onSignIn={handleSignIn}
                loading={isLoading}
            />
            <SignInFooter />
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
};