import { useState, useCallback } from 'react';
import { useToast, FlatList } from 'native-base';

import { useFocusEffect } from '@react-navigation/native';

import { api } from '../services/api';

import { Loading } from './Loading';
import { Game, GameProps } from '../components/Game';
import { EmptyMyPollList } from './EmptyMyPollList';

interface GuessesProps {
  pollId: string;
  code: string;
  onShare: () => void;
}

export function Guesses({ pollId, code, onShare }: GuessesProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);

      const response = await api.get(`/polls/${pollId}/games`);
      setGames(response.data.games);

      
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Não foi possível carregar os jogos',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    setIsLoading(true);
    try {
      console.log(firstTeamPoints);
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar para esse jogo',
          placement: 'top',
          bgColor: 'red.500'
        })
      }
      

      await api.post(`polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
          title: 'Palpite realizado com sucesso!',
          placement: 'top',
          bgColor: 'green.500'
        });

        fetchGames();
      
    } catch (error) {
      console.log(error);

      if (error.response?.data?.message === 'Game not found.') {
        return toast.show({
          title: 'Jogo não encontrado',
          placement: 'top',
          bgColor: 'red.500'
        });        
      }

      if (error.response?.data?.message === 'You cannot send guesses after the game date.') {
        return toast.show({
          title: 'Desculpe, esse jogo já foi realizado',
          placement: 'top',
          bgColor: 'red.500'
        });        
      }

      toast.show({
        title: 'Não foi possível enviar o palpite',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchGames();
  }, [pollId]));

  if (isLoading) {
    return (<Loading />)
  }


  return (
    <FlatList 
      data={games}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
          isLoading={isLoading}
        />
      )}
      showsVerticalScrollIndicator={false}
      _contentContainerStyle={{ pb: 90 }}
      ListEmptyComponent={() => <EmptyMyPollList code={code} onShare={onShare}/>}
    />
  );
}
