import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Pressable, Text, View } from 'react-native';
import { pb } from '../lib/pb_client';
import { RootStackParamList } from '../types/router';

type Post = {
  id: string;
  title: string;
  text: string;
};

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    pb.collection('posts')
      .getFirstListItem('', { $autoCancel: false })
      .then((post) => setPost(post as unknown as Post))
      .catch((err) => console.log(err));
  }, []);

  if (!post) {
    return <ActivityIndicator className="mt-10" />;
  }

  return (
    <View className="flex-1 bg-gray-200">
      <View className="bg-white p-6">
        <Text className="mb-4 text-xl font-bold">{post.title}</Text>
        <Text className="text-gray-600">{post.text}</Text>
        <Text className="mt-5 text-xs italic text-gray-500">
          Этот пост можно изменить в в закрытом разделе
        </Text>
      </View>
      <Button onPress={() => navigation.navigate('Private')} title="Перейти в закрытый раздел" />
    </View>
  );
}
