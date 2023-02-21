import { pb } from '../lib/pb_client';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/router';
import type { Post } from '../types/post';

type Props = NativeStackScreenProps<RootStackParamList, 'Private'>;

export default function PrivateScreen({ navigation }: Props) {
  const isFocused = useIsFocused();
  const [post, setPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigation.replace('Login');
      return;
    }

    pb.collection('posts')
      .getFirstListItem('', { $autoCancel: false })
      .then((post) => setPost(post as unknown as Post))
      .catch((err) => console.log(err));
  }, [isFocused]);

  const handleSignOut = () => {
    pb.authStore.clear();
    navigation.replace('Home');
  };

  const handleSubmitChanges = async () => {
    if (!post) return;

    setIsSubmitting(true);
    Keyboard.dismiss();

    try {
      const result = await pb.collection('posts').update(post.id, { ...post });
      setPost(result as unknown as Post);
      setIsSubmitting(false);
      Alert.alert('Сохранено успешно.');
    } catch (err) {
      setIsSubmitting(false);
      console.log(err);
    }
  };

  if (!post) {
    return <ActivityIndicator className="mt-10" />;
  }

  return (
    <View className="flex-1 bg-gray-200">
      <View className="bg-white p-6">
        <TextInput
          className="mb-4 rounded-md border-2 p-1 text-xl font-bold"
          onChangeText={(title) => setPost(() => ({ ...post, title }))}
          value={post.title}
        />
        <TextInput
          className="rounded-md border-2 p-1 text-gray-600"
          value={post.text}
          multiline
          onChangeText={(text) => setPost(() => ({ ...post, text }))}
        />

        <View className="mt-5 gap-x-4 flex flex-row items-center">
          <Pressable disabled={isSubmitting} onPress={handleSubmitChanges}>
            <Text className="underline">Сохранить изменения</Text>
          </Pressable>
          {isSubmitting && <ActivityIndicator />}
        </View>
      </View>
      <View className="flex flex-row items-center justify-between p-4">
        <Pressable
          className="p-2 rounded-md bg-blue-500"
          onPress={() => navigation.navigate('Home')}
        >
          <Text className="text-white">На главную</Text>
        </Pressable>
        <Text>Я: {pb.authStore.model?.username}</Text>
        <Pressable className="p-2 rounded-md bg-blue-500" onPress={handleSignOut}>
          <Text className="text-white">Выйти</Text>
        </Pressable>
      </View>
    </View>
  );
}
