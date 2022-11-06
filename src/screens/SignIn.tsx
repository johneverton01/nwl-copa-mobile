import { VStack, Text, Icon } from 'native-base';
import { Fontisto } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

import Logo from '../assets/logo.svg';
import { Button } from '../components/Button';

export function SignIn() {
  const { signIn, isUserLoading } = useAuth();
  return (
    <VStack 
      flex={1} 
      bgColor="gray.900" 
      alignItems="center" 
      justifyContent="center"
      p={7}
    >
      <Logo 
        width={212} 
        height={40} 
      />

      <Button
        leftIcon={
          <Icon as={Fontisto}
          name="google"
          color="white"
          size="md" 
        />} 
        title="Entrar com Google"
        type='SECONDARY'
        mt={12}
        onPress={signIn}
        isLoading={isUserLoading}
      />

      <Text color="white" textAlign="center" mt={4}>
        Não utilizamos nenhuma informação além {'\n'}
        do seu e-mail para criação de sua conta.
      </Text>
    </VStack>
  )
}