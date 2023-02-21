import { pb } from '../lib/pb_client';
import { useState, useEffect } from 'react';
import { TextInput, View, Text, Pressable } from 'react-native';
import { RootStackParamList } from '../types/router';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

function signUp(username: string, password: string) {
  const data = {
    username,
    password,
    passwordConfirm: password,
  };

  return pb.collection('users').create(data);
}

function signIn(username: string, password: string) {
  return pb.collection('users').authWithPassword(username, password);
}

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (submitType: 'signup' | 'signin') => {
    if (password.length < 8) {
      setError('Минимальная длина пароля 8 символов');
      return;
    }

    if (username.length < 4) {
      setError('Минимальная длина имени пользователя 4 символа');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      if (submitType === 'signup') {
        await signUp(username, password);
        await signIn(username, password);
      } else {
        await signIn(username, password);
      }

      setUsername('');
      setPassword('');
      setIsSubmitting(false);

      navigation.replace('Private');
    } catch (err) {
      console.log(err);
      setError('Что то пошло не так, проверьте правильность введенных данных.');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (pb.authStore.isValid) {
      navigation.replace('Private');
    }
  }, []);

  return (
    <View className="flex-1 gap-y-6 rounded-md bg-white p-6">
      <View className="grid gap-1">
        <TextInput
          placeholder="Имя пользователя"
          value={username}
          onChangeText={setUsername}
          className="rounded-sm border-2 border-gray-400 p-2"
        />
        <TextInput
          placeholder="Пароль"
          textContentType="password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="rounded-sm border-2 border-gray-400 p-2"
        />
      </View>
      {error && <Text className="text-red-500">{error}</Text>}
      {isSubmitting && <Text>Авторизация...</Text>}
      <View className="gap-y-2">
        <Pressable
          onPress={() => handleSubmit('signin')}
          className={'rounded-md bg-blue-400 p-2 items-center ' + (isSubmitting && 'bg-gray-400')}
          disabled={isSubmitting}
        >
          <Text className="text-white">Войти</Text>
        </Pressable>
        <Pressable
          onPress={() => handleSubmit('signup')}
          className={'rounded-md bg-blue-400 p-2 items-center ' + (isSubmitting && 'bg-gray-400')}
          disabled={isSubmitting}
        >
          <Text className="text-white">Зарегистрироваться</Text>
        </Pressable>
      </View>
    </View>
  );
}
