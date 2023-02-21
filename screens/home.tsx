import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { pb } from '../lib/pb_client';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/router';
import type { Post } from '../types/post';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const isFocused = useIsFocused();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    setPost(null);

    pb.collection('posts')
      .getFirstListItem('', { $autoCancel: false })
      .then((post) => setPost(post as unknown as Post))
      .catch((err) => console.log(err));
  }, [isFocused]);

  if (!post) {
    return <ActivityIndicator className="mt-10" />;
  }

  return (
    <View className="flex-1 bg-gray-200">
      <View className="bg-white p-6">
        <Text className="mb-4 text-xl font-bold">{post.title}</Text>
        <Text className="text-gray-600">{post.text}</Text>
        <Text className="mt-5 text-xs italic text-gray-500">
          Этот пост можно изменить в закрытом разделе
        </Text>
      </View>
      <View className="flex flex-row p-4 justify-end">
        <Pressable
          className="p-2 rounded-md bg-blue-500"
          onPress={() => navigation.navigate('Private')}
        >
          <Text className="text-white">Перейти в закрытый раздел</Text>
        </Pressable>
      </View>
    </View>
  );
}
