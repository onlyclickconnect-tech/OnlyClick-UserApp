import { Link } from 'expo-router';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const SignInFooter = () => {
    return (
        <Link href="/protected/" asChild>
            <TouchableOpacity style={styles.skipContainer}>
                <Text style={styles.skipText}>Continue without login</Text>
            </TouchableOpacity>
        </Link>
    );
};

const styles = StyleSheet.create({
    skipContainer: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    skipText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default SignInFooter;