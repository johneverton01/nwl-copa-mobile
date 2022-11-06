import { useState, useEffect } from 'react';
import { Share } from 'react-native';
import { HStack, useToast, VStack } from 'native-base';
import { useRoute } from '@react-navigation/native';

import { api } from '../services/api';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { PollPros } from '../components/PollCard';
import { PollHeader } from '../components/PollHeader';
import { EmptyMyPollList } from '../components/EmptyMyPollList';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';

interface RouteParams {
  id: string;
}

export function Details() {
  const [isOptionSelected, setIsOptionSelected] = 
  useState<'guesses' | 'ranking'>('guesses');
  const [isLoading, setIsLoading] = useState(true);
  const [pollDetails, setPollDetails] = useState<PollPros>({} as PollPros);

  const route = useRoute();
  const toast = useToast();
  const { id } = route.params as RouteParams;

  async function fetchPollsDerails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/polls/${id}`);
      setPollDetails(response.data.polls);
      
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pollDetails.code
    });
  }

  useEffect(() => {
    fetchPollsDerails();
  }, [id])

  if (isLoading) {
    return ( 
      <Loading />
    );
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header 
        title={pollDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {
        pollDetails._count?.participants > 0 ?
        <VStack px={5} flex={1}>
          <PollHeader data={pollDetails} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option 
              title="Seus palpites" 
              isSelected={isOptionSelected === "guesses"}
              onPress={() => setIsOptionSelected("guesses")} 
            />
            <Option 
              title="Ranking do grupo" 
               isSelected={isOptionSelected === "ranking"}
              onPress={() => setIsOptionSelected("ranking")} 
            />
          </HStack>

          <Guesses 
            pollId={pollDetails.id} 
            code={pollDetails.code}
            onShare={handleCodeShare} 
          />
        </VStack>
        :
        <EmptyMyPollList 
          code={pollDetails.code}
          onShare={handleCodeShare} 
        />
      }

    </VStack>
  );
}