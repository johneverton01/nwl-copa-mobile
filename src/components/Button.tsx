import { Button as ButtonNativeBase, Text, IButtonProps } from 'native-base';

interface PropsButton extends IButtonProps{
  title: string;
  type?: 'PRIMARY' | 'SECONDARY';
}

export function Button({ title, type = 'PRIMARY',...rest }: PropsButton) {
  return (
      <ButtonNativeBase
        w="full"
        h={14}
        rounded="sm"
        fontSize="md"
        bg={ type === 'SECONDARY' ? 'red.500' : 'yellow.500' } 
        _pressed={{
          bg: type === 'SECONDARY' ? 'red.600' : 'yellow.600'
        }}
        _loading={{
          _spinner: { color: type === 'SECONDARY' ? 'white' : 'black' }
        }}
        {...rest}
      >
        <Text
          fontSize="sm"
          textTransform="uppercase"
          fontFamily="heading"
          color={ type === 'SECONDARY' ? 'white' : 'black' }
        >
          {title}
        </Text>
      </ButtonNativeBase>
  )
}